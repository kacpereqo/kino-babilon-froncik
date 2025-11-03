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
        class="calendar-day "
        :class="{
          'calendar-other-month': !isCurrentMonth(day),
          'calendar-playing' : isPlayingToday(day)
        }"
      >
        <strong>{{ dayToDayOfMonth(day) }}</strong>
      </div>
    </div>
    <div id="description">
      <strong>{{ selectedDate ? dateFormat(selectedDate) : '' }}</strong>
      <p>
        <ul class="calendar-screenings" v-if="dayScreenings.length > 0">
          <li v-for="screening in dayScreenings" :key="screening.sid">
            {{ new Date(screening.start_datetime).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) }} 
            · {{ datetimeLength(screening.start_datetime, screening.end_datetime) }} 
            · {{ screening.location }}
            <p>
              {{ screening.description }}
            </p>
          </li>
        </ul>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useScreeningsStore } from '@/stores/screenings'

const screeningsStore = useScreeningsStore()

const gridDays = 7 * 6
const dayScreenings = ref<Array<ScreeningResponse>>([])

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
  await screeningsStore.fetchAll()
})

const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)

function dateFormat(date: Date): string {
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function datetimeLength(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const diffMs = endDate.getTime() - startDate.getTime()
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffHrs === 0) return `${diffMins} min`
  else if (diffMins === 0) return `${diffHrs} h`
  else return `${diffHrs}h ${diffMins}min`
}

async function getDayScreenings(day: number): Promise<void> {
  const date = dayToDate(day)
  dayScreenings.value = await screeningsStore.fetchByDate(date)
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

function isPlayingToday(day: number): boolean {
  const date = dayToDate(day)
  return screeningsStore.isPlayingOnDate(date)
}

async function onClickDay(day: number) {
  selectedDate.value = dayToDate(day)
  await getDayScreenings(day)
}


const daysInCurrentMonth = computed(() =>
  getDaysInMonth(currentDate.value.getMonth(), currentDate.value.getFullYear()),
)

const daysInPreviousMonth = computed(() =>
  getDaysInMonth((currentDate.value.getMonth() - 1 + 12) % 12, currentDate.value.getFullYear()),
)

const firstDayOfMonth = computed(() => {
  const day = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay()
  return (day + 6) % 7 // make Monday = 0
})

const formattedDate = computed(() =>
  currentDate.value.toLocaleString('pl-PL', { month: 'long', year: 'numeric' }),
)

function isCurrentMonth(day: number): boolean {
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

.calendar-screenings {
  margin-left: 20px;
}

li p{
  margin-left: 20px;
  color: darkgray;
  list-style: circle;
}

ul li{
  margin-bottom: 5px;
}
</style>
