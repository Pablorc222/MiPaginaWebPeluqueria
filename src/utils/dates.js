// =========================================================
// UTILIDADES DE FECHAS
//
// Antes estas funciones estaban duplicadas dentro de
// App.jsx y AdminApp.jsx. Ahora viven en un único sitio.
// =========================================================

export const MONTH_NAMES = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
]

export const WEEK_DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

// Devuelve la fecha de hoy con la hora a 00:00:00
export function getToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

// Devuelve la fecha de hoy en formato YYYY-MM-DD (para Supabase)
export function getTodayForDatabase() {
  return formatDateForDatabase(new Date())
}

// Date -> "DD/MM/YYYY"
export function formatDate(date) {
  if (!date) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

// Date -> "YYYY-MM-DD" (formato que espera Supabase)
export function formatDateForDatabase(date) {
  if (!date) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// "YYYY-MM-DD" (string de la base de datos) -> "DD/MM/YYYY"
export function formatDateFromDb(dbDate) {
  if (!dbDate) return ''

  const parts = String(dbDate).split('-')

  if (parts.length !== 3) {
    return String(dbDate)
  }

  const [year, month, day] = parts

  return `${day}/${month}/${year}`
}

// "HH:MM:SS" -> "HH:MM"
export function formatTime(time) {
  if (!time) return ''
  return String(time).slice(0, 5)
}

export function isPastDate(date) {
  if (!date) return false

  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)

  return checkDate < getToday()
}

export function isSunday(date) {
  if (!date) return false
  return date.getDay() === 0
}

export function isSameDay(dateA, dateB) {
  if (!dateA || !dateB) return false
  return formatDate(dateA) === formatDate(dateB)
}

export function isToday(date) {
  if (!date) return false

  const today = getToday()

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

// Genera la cuadrícula de días para el calendario mensual,
// incluyendo huecos vacíos antes del día 1 para alinear
// con la fila de la semana (Lunes -> Domingo).
export function getCalendarDays(currentMonth) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let startDay = firstDay.getDay()
  // JS: Domingo = 0, Lunes = 1 -> nuestro calendario: Lunes = 0, Domingo = 6
  startDay = startDay === 0 ? 6 : startDay - 1

  const days = []

  for (let i = 0; i < startDay; i++) {
    days.push(null)
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }

  return days
}
