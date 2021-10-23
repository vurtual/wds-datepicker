import { getDay, format, getDate } from 'date-fns'
const button = document.querySelector('.date-picker-button')
const datepicker = document.querySelector('.date-picker')
const currentMonth = document.querySelector('.current-month')
const grid = document.querySelector('.date-picker-grid-dates')
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const datePickerViewDate = new Date()
const selectedDate = new Date()

updateDOM()

addEventListener('click', e => {
  if (!e.target.matches('.date-picker-button')) return
  datepicker.classList.toggle('show')
})

addEventListener('click', e => {
  if (!e.target.matches('.month-button')) return
  if (e.target.matches('.prev-month-button')) changeMonth(-1)
  if (e.target.matches('.next-month-button')) changeMonth(1)
})

addEventListener('click', e => {
  if (!e.target.matches('.date')) return
  const selected = document.querySelector('.selected')
  e.target.classList.add('selected')
  if (selected) selected.classList.remove('selected')
  const dateArray = e.target.dataset.date.split(',')
  selectedDate.setFullYear(dateArray[0])
  selectedDate.setMonth(dateArray[1])
  selectedDate.setDate(dateArray[2])
  console.log(selectedDate, datePickerViewDate)
  updateButtonText()
  if (e.target.matches('.date-picker-other-month-date')) {
    datePickerViewDate.setFullYear(dateArray[0])
    datePickerViewDate.setMonth(dateArray[1])
    datePickerViewDate.setDate(dateArray[2])
    updateDatePicker()
  }
})

function changeMonth(advance) {
  datePickerViewDate.setMonth(datePickerViewDate.getMonth() + advance)
  console.log(selectedDate, datePickerViewDate)
  updateDatePicker()
}

function formatDateString(date) {
  return format(date, 'do MMMM yyyy')
}

function formatCurrentMonth(date) {
  return format(date, 'MMMM - yyyy')
}

function updateCurrentMonth() {
  currentMonth.innerText = formatCurrentMonth(datePickerViewDate)
}

function getDaysFromPreviousMonth() {
  let currentDay = getFirstWeekdayOfCurrentMonth()
  let currentDate = getFirstOfCurrentMonth()
  const daysFromPreviousMonth = []
  while (currentDay > 0) {
    currentDay--
    currentDate.setDate(currentDate.getDate() - 1)
    let date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
    daysFromPreviousMonth.unshift(date)
  }
  return daysFromPreviousMonth
}

function getDaysFromCurrentMonth() {
  let currentDate = getFirstOfCurrentMonth()
  const month = currentDate.getMonth()
  const daysFromMonth = []
  while (currentDate.getMonth() === month) {
    let date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
    daysFromMonth.push(date)
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return daysFromMonth
}

function getDaysFromNextMonth() {
  let currentDate = new Date(getFirstOfCurrentMonth())
  currentDate.setMonth(currentDate.getMonth() + 1)
  const daysFromNextMonth = []
  let currentDay = getDay(currentDate)
  while (currentDay <= 6) {
    let date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
    daysFromNextMonth.push(date)
    currentDate.setDate(currentDate.getDate() + 1)
    currentDay++
  }
  return daysFromNextMonth
}

function getFirstOfCurrentMonth() {
  const year = datePickerViewDate.getFullYear()
  const month = datePickerViewDate.getMonth()
  return new Date(year, month, 1)
}

function getFirstWeekdayOfCurrentMonth() {
  return getDay(getFirstOfCurrentMonth())
}

function dateArray(date) {
  return [date.getFullYear(), date.getMonth(), date.getDate()]
}

function clearDatePicker() {
  const dates = grid.children
  while (dates.length > 0) {
    dates[0].remove()
  }
}

function insertDateButtons(dates, isCurrentMonth) {
  dates.forEach(date => {
    const dateButton = document.createElement('button')
    dateButton.innerText = date.getDate()
    dateButton.classList.add('date')
    isCurrentMonth || dateButton.classList.add('date-picker-other-month-date')
    formatDateString(date) !== button.innerText ||
      dateButton.classList.add('selected')
    dateButton.dataset.date = dateArray(date)
    grid.append(dateButton)
  })
}

function updateCurrentDays() {
  const daysFromPreviousMonth = getDaysFromPreviousMonth()
  const daysFromCurrentMonth = getDaysFromCurrentMonth()
  const daysFromNextMonth = getDaysFromNextMonth()
  clearDatePicker()
  insertDateButtons(daysFromPreviousMonth, false)
  insertDateButtons(daysFromCurrentMonth, true)
  insertDateButtons(daysFromNextMonth, false)
}

function updateButtonText() {
  button.innerText = formatDateString(selectedDate)
}

function updateDatePicker() {
  updateCurrentMonth()
  updateCurrentDays()
}

function updateDOM() {
  updateButtonText()
  updateDatePicker()
}
