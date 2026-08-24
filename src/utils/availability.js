import { isToday } from './dates'

const SLOT_MINUTES = 30

function timeToMinutes(time) {
  const [hours, minutes] = String(time)
    .slice(0, 5)
    .split(':')
    .map(Number)

  return hours * 60 + minutes
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(
    2,
    '0'
  )}`
}

/*
 * Genera automáticamente las horas entre apertura y cierre.
 *
 * 10:00 -> 20:00
 *
 * 10:00
 * 10:30
 * ...
 * 19:30
 */
export function generateTimeSlots(
  openingTime,
  closingTime
) {
  if (!openingTime || !closingTime) {
    return []
  }

  const opening = timeToMinutes(openingTime)
  const closing = timeToMinutes(closingTime)

  if (
    Number.isNaN(opening) ||
    Number.isNaN(closing)
  ) {
    return []
  }

  if (closing <= opening) {
    return []
  }

  const slots = []

  for (
    let minutes = opening;
    minutes < closing;
    minutes += SLOT_MINUTES
  ) {
    slots.push(minutesToTime(minutes))
  }

  return slots
}

export function isTimeOccupied(
  time,
  occupiedTimes
) {
  if (!Array.isArray(occupiedTimes)) {
    return false
  }

  const normalizedTime = String(time).slice(0, 5)

  return occupiedTimes.some(
    (item) =>
      String(item).slice(0, 5) ===
      normalizedTime
  )
}

export function isTimePast(
  time,
  selectedDate
) {
  if (!selectedDate || !time) {
    return false
  }

  if (!isToday(selectedDate)) {
    return false
  }

  const now = new Date()

  const [hours, minutes] = String(time)
    .slice(0, 5)
    .split(':')
    .map(Number)

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return false
  }

  const timeDate = new Date(selectedDate)

  timeDate.setHours(
    hours,
    minutes,
    0,
    0
  )

  return timeDate <= now
}

export function getAvailableTimes(
  selectedDate,
  occupiedTimes = [],
  openingTime = '10:00',
  closingTime = '20:00'
) {
  const timeSlots = generateTimeSlots(
    openingTime,
    closingTime
  )

  return timeSlots.filter((time) => {
    if (
      isTimeOccupied(
        time,
        occupiedTimes
      )
    ) {
      return false
    }

    if (
      isTimePast(
        time,
        selectedDate
      )
    ) {
      return false
    }

    return true
  })
}

export function getSlotsWithStatus(
  selectedDate,
  occupiedTimes = [],
  blockedTimesMap = new Map(),
  openingTime = '10:00',
  closingTime = '20:00'
) {
  const blocked =
    blockedTimesMap instanceof Map
      ? blockedTimesMap
      : new Map()

  const timeSlots =
    generateTimeSlots(
      openingTime,
      closingTime
    )

  return timeSlots.map((time) => {
    /*
     * BLOQUEADA MANUALMENTE
     */
    if (blocked.has(time)) {
      return {
        time,
        status: 'blocked',
        reason:
          blocked.get(time) ||
          'Horario bloqueado',
      }
    }

    /*
     * OCUPADA POR UNA CITA
     */
    if (
      isTimeOccupied(
        time,
        occupiedTimes
      )
    ) {
      return {
        time,
        status: 'occupied',
        reason: 'Ya reservada',
      }
    }

    /*
     * YA HA PASADO
     */
    if (
      isTimePast(
        time,
        selectedDate
      )
    ) {
      return {
        time,
        status: 'past',
        reason: 'Hora pasada',
      }
    }

    /*
     * DISPONIBLE
     */
    return {
      time,
      status: 'available',
      reason: '',
    }
  })
}