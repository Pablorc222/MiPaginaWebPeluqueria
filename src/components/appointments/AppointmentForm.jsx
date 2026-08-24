import { useState } from 'react'
import Calendar from '../calendar/Calendar'
import { formatDate } from '../../utils/dates'

export default function AppointmentForm({
  services,
  servicesLoading,
  selectedService,
  onServiceChange,

  currentMonth,
  onChangeMonth,
  selectedDate,
  onSelectDate,
  blockedDaysMap,

  closedWeekday,

  selectedTime,
  onSelectTime,
  occupiedTimesLoading,
  slots,

  isSubmitting,
  onSubmit,
}) {
  const [step, setStep] = useState(1)

  const hasAvailable = slots?.some(
    (slot) => slot.status === 'available'
  )

  /*
   * =========================================================
   * PASAR AL SIGUIENTE PASO
   * =========================================================
   */

  const nextStep = () => {
    if (step === 1 && !selectedService) {
      return
    }

    if (step === 2 && !selectedDate) {
      return
    }

    if (step === 3 && !selectedTime) {
      return
    }

    setStep((current) => Math.min(current + 1, 4))
  }

  /*
   * =========================================================
   * VOLVER
   * =========================================================
   */

  const previousStep = () => {
    setStep((current) => Math.max(current - 1, 1))
  }

  /*
   * =========================================================
   * CAMBIAR SERVICIO
   * =========================================================
   */

  const handleServiceChange = (event) => {
    onServiceChange(event)

    // Si cambia el servicio volvemos al paso 1
    setStep(1)
  }

  /*
   * =========================================================
   * CAMBIAR FECHA
   * =========================================================
   */

  const handleSelectDate = (date) => {
    onSelectDate(date)

    // Al seleccionar fecha pasamos automáticamente a horas
    setStep(3)
  }

  /*
   * =========================================================
   * CAMBIAR HORA
   * =========================================================
   */

  const handleSelectTime = (time) => {
    onSelectTime(time)

    // Al seleccionar hora pasamos a datos
    setStep(4)
  }

  return (
    <form
      onSubmit={onSubmit}
      className="appointment-form"
    >
      {/* =====================================================
          PROGRESO
      ===================================================== */}

      <div className="booking-progress">
        <div
          className={
            step >= 1
              ? 'progress-item active'
              : 'progress-item'
          }
        >
          <span>01</span>
          <small>Servicio</small>
        </div>

        <div className="progress-line" />

        <div
          className={
            step >= 2
              ? 'progress-item active'
              : 'progress-item'
          }
        >
          <span>02</span>
          <small>Día</small>
        </div>

        <div className="progress-line" />

        <div
          className={
            step >= 3
              ? 'progress-item active'
              : 'progress-item'
          }
        >
          <span>03</span>
          <small>Hora</small>
        </div>

        <div className="progress-line" />

        <div
          className={
            step >= 4
              ? 'progress-item active'
              : 'progress-item'
          }
        >
          <span>04</span>
          <small>Datos</small>
        </div>
      </div>

      {/* =====================================================
          PASO 1 · SERVICIO
      ===================================================== */}

      {step === 1 && (
        <section className="booking-step">
          <div className="booking-step-header">
            <span className="eyebrow">
              PASO 01
            </span>

            <h3>
              Elige tu <em>servicio</em>
            </h3>

            <p>
              Selecciona el servicio que quieres
              reservar.
            </p>
          </div>

          {servicesLoading ? (
            <div className="service-select-loading">
              Cargando servicios...
            </div>
          ) : services.length === 0 ? (
            <div className="service-select-error">
              No se han encontrado servicios.
              <br />
              Revisa la conexión con Supabase.
            </div>
          ) : (
            <div className="service-options">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={
                    selectedService?.id === service.id
                      ? 'service-option selected'
                      : 'service-option'
                  }
                  onClick={() => {
                    onServiceChange({
                      target: {
                        value: service.id,
                      },
                    })

                    setStep(2)
                  }}
                >
                  <span className="service-option-info">
                    <strong>
                      {service.name}
                    </strong>

                    <small>
                      Servicio profesional
                    </small>
                  </span>

                  <span className="service-option-price">
                    {service.price} €
                  </span>

                  <span className="service-option-arrow">
                    →
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          PASO 2 · FECHA
      ===================================================== */}

      {step === 2 && (
        <section className="booking-step">
          <div className="booking-step-header">
            <span className="eyebrow">
              PASO 02
            </span>

            <h3>
              Elige el <em>día</em>
            </h3>

            <p>
              Selecciona el día que mejor te venga.
            </p>
          </div>

          <Calendar
            currentMonth={currentMonth}
            onChangeMonth={onChangeMonth}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            blockedDaysMap={blockedDaysMap}
            closedWeekday={closedWeekday}
            disableBlockedDays
          />

          {selectedDate && (
            <div className="selected-date">
              <span>
                FECHA SELECCIONADA
              </span>

              <strong>
                {formatDate(selectedDate)}
              </strong>
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          PASO 3 · HORA
      ===================================================== */}

      {step === 3 && (
        <section className="booking-step">
          <div className="booking-step-header">
            <span className="eyebrow">
              PASO 03
            </span>

            <h3>
              Elige la <em>hora</em>
            </h3>

            {selectedDate && (
              <p>
                {formatDate(selectedDate)}
              </p>
            )}
          </div>

          {occupiedTimesLoading ? (
            <div className="booking-loading">
              Comprobando horarios...
            </div>
          ) : (
            <>
              <div className="time-grid">
                {slots.map(
                  ({
                    time,
                    status,
                    reason,
                  }) => {
                    const disabled =
                      status !== 'available'

                    let title = ''

                    if (
                      status === 'blocked'
                    ) {
                      title = `Bloqueado: ${
                        reason ||
                        'Sin motivo'
                      }`
                    }

                    if (
                      status === 'occupied'
                    ) {
                      title =
                        'Esta hora ya está reservada'
                    }

                    if (
                      status === 'past'
                    ) {
                      title =
                        'Esta hora ya ha pasado'
                    }

                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={disabled}
                        title={title}
                        className={[
                          'time-button',
                          `time-button--${status}`,
                          selectedTime === time
                            ? 'selected'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() =>
                          handleSelectTime(time)
                        }
                      >
                        <span>
                          {time}
                        </span>
                      </button>
                    )
                  }
                )}
              </div>

              <div className="availability-legend">
                <div className="availability-legend-item">
                  <span className="availability-dot availability-dot--available" />
                  <span>
                    Disponible
                  </span>
                </div>

                <div className="availability-legend-item">
                  <span className="availability-dot availability-dot--occupied" />
                  <span>
                    Ocupada
                  </span>
                </div>

                <div className="availability-legend-item">
                  <span className="availability-dot availability-dot--blocked" />
                  <span>
                    Bloqueada
                  </span>
                </div>

                <div className="availability-legend-item">
                  <span className="availability-dot availability-dot--past" />
                  <span>
                    Pasada
                  </span>
                </div>
              </div>

              {!hasAvailable && (
                <div className="service-select-error">
                  No quedan horas disponibles
                  para este día.
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* =====================================================
          PASO 4 · DATOS
      ===================================================== */}

      {step === 4 && (
        <section className="booking-step">
          <div className="booking-step-header">
            <span className="eyebrow">
              PASO 04
            </span>

            <h3>
              Tus <em>datos</em>
            </h3>

            <p>
              Solo necesitamos estos datos
              para confirmar tu cita.
            </p>
          </div>

          {/* RESUMEN */}

          <div className="booking-summary">
            <div>
              <span>
                SERVICIO
              </span>

              <strong>
                {selectedService?.name}
              </strong>
            </div>

            <div>
              <span>
                FECHA
              </span>

              <strong>
                {selectedDate
                  ? formatDate(selectedDate)
                  : ''}
              </strong>
            </div>

            <div>
              <span>
                HORA
              </span>

              <strong>
                {selectedTime}
              </strong>
            </div>
          </div>

          {/* DATOS */}

          <div className="booking-data">
            <div>
              <label htmlFor="name">
                NOMBRE
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                autoComplete="name"
                minLength={2}
                required
              />
            </div>

            <div>
              <label htmlFor="phone">
                TELÉFONO
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="600 000 000"
                autoComplete="tel"
                inputMode="numeric"
                pattern="[6789][0-9\s.-]{8,12}"
                title="Introduce un teléfono español válido de 9 dígitos."
                required
              />
            </div>

            <div>
              <label htmlFor="email">
                EMAIL
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@gmail.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="primary-button booking-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'GUARDANDO...'
              : 'CONFIRMAR CITA →'}
          </button>
        </section>
      )}

           {/* =====================================================
          NAVEGACIÓN
      ===================================================== */}

      <div className="booking-navigation">
        {step > 1 ? (
          <button
            type="button"
            className="booking-back"
            onClick={previousStep}
          >
            ← ATRÁS
          </button>
        ) : (
          <div />
        )}

        {step === 1 && (
          <button
            type="button"
            className="booking-next"
            disabled={!selectedService}
            onClick={nextStep}
          >
            CONTINUAR →
          </button>
        )}

        {step === 2 && (
          <button
            type="button"
            className="booking-next"
            disabled={!selectedDate}
            onClick={nextStep}
          >
            CONTINUAR →
          </button>
        )}

        {step === 3 && (
          <button
            type="button"
            className="booking-next"
            disabled={!selectedTime}
            onClick={nextStep}
          >
            CONTINUAR →
          </button>
        )}

        {step === 4 && (
          <div className="booking-final-space" />
        )}
      </div>
    </form>
  )
}