import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ScreeningResponse {
  sid: number
  mid: number
  creator_uid: number
  location: string
  start_datetime: string
  end_datetime: string
  description: string
  selection_mode: string
}

interface CachedEntry {
  data: ScreeningResponse[]
  timestamp: number
}

export const useScreeningsStore = defineStore('screenings', () => {
  const screenings = ref<ScreeningResponse[]>([])
  const cache = ref<Record<string, CachedEntry>>({})

  const CACHE_TTL = 1000 * 60 * 60 * 24

  const API_URL = import.meta.env.VITE_API_URL

  async function fetchAll() {
    const url = `${API_URL}/screenings/basic-by-date-range`
    const params = {
      start_date: '2025-01-01T00:00:00',
      end_date: '2025-12-31T23:59:59',
    }

    const queryString = new URLSearchParams(params).toString()
    const fullUrl = `${url}?${queryString}`

    try {
      const res = await fetch(fullUrl)
      if (!res.ok) throw new Error('Failed to fetch all screenings')
      screenings.value = await res.json()
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchByDate(date: Date): Promise<ScreeningResponse[]> {
    const key = date.toISOString().split('T')[0]
    if (!key) throw new Error('Invalid date provided')

    const cached = cache.value[key]

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }

    const start_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
    const end_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)

    const params = new URLSearchParams({
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString(),
    })
    const fullUrl = `${API_URL}/screenings/by-date-range?${params}`

    try {
      const res = await fetch(fullUrl)
      if (!res.ok) throw new Error('Failed to fetch day screenings')
      const data = await res.json()
      cache.value[key] = { data, timestamp: Date.now() }
      return data
    } catch (err) {
      console.error(err)
      return []
    }
  }

  /** Helper: check if something is playing on a given date */
  function isPlayingOnDate(date: Date): boolean {
    return screenings.value.some((s) => {
      const sd = new Date(s.start_datetime)
      return (
        sd.getFullYear() === date.getFullYear() &&
        sd.getMonth() === date.getMonth() &&
        sd.getDate() === date.getDate()
      )
    })
  }

  return {
    screenings,
    cache,
    fetchAll,
    fetchByDate,
    isPlayingOnDate,
  }
})
