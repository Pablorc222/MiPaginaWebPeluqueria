import {
  MONTH_NAMES,
  getCalendarDays,
  formatDateForDatabase,
} from '../../utils/dates'

import CalendarWeek from './CalendarWeek'
import CalendarDay from './CalendarDay'

export default function Calendar({
  currentMonth,
  onChangeMonth,
  selectedDate,
  onSelectDate,

  helpText = 'Selecciona un día disponible',

  blockedDaysMap = null,

  closedWeekday = 0,

  disableBlockedDays = true,
}) {
  const calendarDays =
    getCalendarDays(currentMonth)

  return (
    <div className="calendar-box">

      <div className="calendar-header">
        <div className="calendar-title">
          <span>
            {MONTH_NAMES[
              currentMonth.getMonth()
            ]}
          </span>

          <strong>
            {currentMonth.getFullYear()}
          </strong>
        </div>

        <div className="calendar-arrows">
          <button
            type="button"
            onClick={() =>
              onChangeMonth(-1)
            }
            aria-label="Mes anterior"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() =>
              onChangeMonth(1)
            }
            aria-label="Mes siguiente"
          >
            ›
          </button>
        </div>
      </div>

      <CalendarWeek />

      <div className="calendar-days">
        {calendarDays.map((date, index) => {
          if (!date) {
            return (
              <span
                key={`empty-${index}`}
                className="empty"
              />
            )
          }

          const dateKey =
            formatDateForDatabase(date)

          const manuallyBlocked =
            Boolean(
              blockedDaysMap &&
              blockedDaysMap.has(dateKey)
            )

          const closedByWeekday =
            date.getDay() ===
            Number(closedWeekday)

          const blocked =
            manuallyBlocked ||
            closedByWeekday

          let blockReason = ''

          if (manuallyBlocked) {
            blockReason =
              blockedDaysMap.get(dateKey) ||
              'Bloqueado desde el dashboard'
          }

          if (closedByWeekday) {
            blockReason =
              'Cerrado semanalmente'
          }

          return (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              selectedDate={selectedDate}
              onSelect={onSelectDate}
              blocked={blocked}
              blockReason={blockReason}
              closedByWeekday={
                closedByWeekday
              }
              disableWhenBlocked={
                disableBlockedDays
              }
            />
          )
        })}
      </div>

      <div className="calendar-status-legend">

        <div className="calendar-legend-item">
          <span className="calendar-dot calendar-dot--available" />
          <span>Disponible</span>
        </div>

        <div className="calendar-legend-item">
          <span className="calendar-dot calendar-dot--blocked" />
          <span>Bloqueado</span>
        </div>

        <div className="calendar-legend-item">
          <span className="calendar-dot calendar-dot--past" />
          <span>Pasado</span>
        </div>

      </div>

      {helpText && (
        <div className="calendar-help">
          <span className="calendar-dot" />
          <span>{helpText}</span>
        </div>
      )}
    </div>
  )
}