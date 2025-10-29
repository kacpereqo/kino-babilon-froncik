<template>
  <div class="container">
    <div>
      <h3>Kalendarz Wydarzeń</h3>
      <p>Sprawdź nadchodzące wydarzenia i seanse w naszym kinie!</p>
    </div>
    <div class="calendar-navigation">
      <button @click="previousMonth"><</button>
      <span>{{ formattedDate }}</span>
      <button @click="nextMonth">></button>
    </div>
    <div id="calendar">
      <div class="calendar-day header">Pn</div>
      <div class="calendar-day header">Wt</div>
      <div class="calendar-day header">Śr</div>
      <div class="calendar-day header">Cz</div>
      <div class="calendar-day header">Pt</div>
      <div class="calendar-day header">Sb</div>
      <div class="calendar-day header">Nd</div>

      <div
        v-for="day in gridDays"
        :key="day"
        @click="onClickDay(day)"
        class="calendar-day calendar-playing"
        :class="{
          'calendar-other-month': !isCurrentMonth(day),
        }"
      >
        <strong>{{ dayToDayOfMonth(day) }}</strong>
      </div>
    </div>
    <div id="description">
      <p>
        <strong>{{ selectedDate ? dateFormat(selectedDate) : '' }}</strong>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const gridDays = 7 * 6
const screenings = ref<Array<ScreeningResponse>>([])

const url = import.meta.env.VITE_API_URL + '/screenings/by_date_range/'
const params = {
  start_date: '2025-01-10',
  end_date: '2025-12-31',
}

const queryString = new URLSearchParams(params).toString()
const fullUrl = `${url}?${queryString}`

interface ScreeningResponse {
  sid: number
  mid: number
  creator_uid: number
  location: string
  start_datetime: string
  end_datetime: string
  description: string
  selection_mode: string
}

onMounted(async () => {
  try {
    const response = await fetch(fullUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    screenings.value = await response.json()
    console.log('Fetched screenings:', screenings.value)
  } catch (error) {
    console.error('Error fetching screenings:', error)
  }
})

const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)

function dateFormat(date: Date): string {
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function dayToDate(day: number): Date {
  const dayOfMonth = dayToDayOfMonth(day)
  const monthOffset = isCurrentMonth(day) ? 0 : day - firstDayOfMonth.value <= 0 ? -1 : 1
  return new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + monthOffset,
    dayOfMonth,
  )
}

function onClickDay(day: number) {
  selectedDate.value = dayToDate(day)
}

const daysInCurrentMonth = computed(() =>
  getDaysInMonth(currentDate.value.getMonth(), currentDate.value.getFullYear()),
)

const daysInPreviousMonth = computed(() =>
  getDaysInMonth((currentDate.value.getMonth() - 1 + 12) % 12, currentDate.value.getFullYear()),
)

const firstDayOfMonth = computed(() => {
  const day = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay()
  // make Monday = 0
  return (day + 6) % 7
})

const formattedDate = computed(() =>
  currentDate.value.toLocaleString('pl-PL', { month: 'long', year: 'numeric' }),
)

function isCurrentMonth(day: number) {
  return day - firstDayOfMonth.value > 0 && day - firstDayOfMonth.value <= daysInCurrentMonth.value
}

function dayToDayOfMonth(day: number): number {
  return day - firstDayOfMonth.value <= 0
    ? daysInPreviousMonth.value - (firstDayOfMonth.value - day)
    : ((day - firstDayOfMonth.value - 1) % daysInCurrentMonth.value) + 1
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.calendar-playing ::after {
  content: '*';
  color: red;
  position: relative;
  font-weight: bold;
  bottom: 4px;
  right: 4px;
}

.header {
  color: red;
  font-weight: bold;
}

.calendar-other-month {
  color: gray;
}

.calendar-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.calendar-navigation span {
  width: 150px;
  text-align: center;
}

.calendar-navigation button {
  cursor: pointer;
}

#calendar {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}
.calendar-day {
  border: 1px solid gray;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.calendar-day:hover {
  background-color: rgba(200, 200, 200, 0.3);
}
</style>
