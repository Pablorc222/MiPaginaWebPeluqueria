import {
  isPastDate,
  isSameDay,
  isToday,
} from '../../utils/dates'

export default function CalendarDay({
  date,
  selectedDate,
  onSelect,

  blocked = false,
  blockReason = '',

  closedByWeekday = false,

  disableWhenBlocked = true,
}) {
  // Casilla vacía
  if (!date) {
    return <span className="empty" />
  }

  // Fecha pasada
  const past = isPastDate(date)

  // Bloqueado o cerrado semanalmente
  const isUnavailable =
    blocked || closedByWeekday

  // Día deshabilitado
  const disabled =
    past ||
    (isUnavailable && disableWhenBlocked)

  // SOLO puede estar seleccionado si está disponible
  const isSelected =
    isSameDay(date, selectedDate) &&
    !past &&
    !isUnavailable

  // Texto informativo
  let title = 'Día disponible'

  if (closedByWeekday) {
    title = `Cerrado: ${
      blockReason || 'día de cierre semanal'
    }`
  } else if (blocked) {
    title = `Bloqueado: ${
      blockReason || 'Bloqueado desde el dashboard'
    }`
  } else if (past) {
    title = 'Día pasado'
  }

  // Clases
  const classes = [
    'calendar-day',

    isSelected
      ? 'selected'
      : '',

    past
      ? 'past-day'
      : '',

    blocked
      ? 'blocked-day'
      : '',

    closedByWeekday
      ? 'closed-weekday'
      : '',

    isToday(date)
      ? 'today'
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  // Click
  const handleClick = () => {
    if (disabled) {
      return
    }

    onSelect(date)
  }

  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      className={classes}
      onClick={handleClick}
    >
      <span className="calendar-day-number">
        {date.getDate()}
      </span>

      {blocked && (
        <span
          className="blocked-day-mark"
          aria-hidden="true"
        />
      )}
    </button>
  )
}