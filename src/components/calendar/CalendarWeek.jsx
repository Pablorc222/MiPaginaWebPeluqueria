import { WEEK_DAYS } from '../../utils/dates'

// Fila de cabecera con las iniciales de los días de la semana
export default function CalendarWeek() {
  return (
    <div className="calendar-weekdays">
      {WEEK_DAYS.map((day) => (
        <span key={day}>{day}</span>
      ))}
    </div>
  )
}
