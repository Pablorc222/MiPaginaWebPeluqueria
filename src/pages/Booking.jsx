import { useEffect, useState } from 'react'

import Header from '../components/layout/Header'
import AppointmentForm from '../components/appointments/AppointmentForm'

import { useServices } from '../hooks/useServices'
import { useAvailability } from '../hooks/useAvailability'
import { useBlockedSchedule } from '../hooks/useBlockedSchedule'
import { useRouter } from '../lib/router'

import {
  getToday,
  formatDate,
  formatDateForDatabase,
  isPastDate,
} from '../utils/dates'

import {
  isTimePast,
} from '../utils/availability'

import {
  validateName,
  validatePhone,
  validateEmail,
} from '../utils/validation'

import {
  isSlotTaken,
  createAppointment,
} from '../services/appointments'

import {
  findClientByPhone,
  createClient,
  updateClient,
} from '../services/clients'

import '../App.css'

const today = getToday()

const WEEKDAY_NAMES = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
]

export default function Booking() {
  const { navigate } = useRouter()

  const {
    services,
    loading: servicesLoading,
  } = useServices()

  const {
    loading: occupiedTimesLoading,
    loadForDate,
    slotsForDate,
    settings,
  } = useAvailability()

  const {
    blockedDaysMap,
    isDateBlocked,
    getBlockReason,
  } = useBlockedSchedule()

  const [selectedService, setSelectedService] =
    useState(null)

  const [currentMonth, setCurrentMonth] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    )

  const [selectedDate, setSelectedDate] =
    useState(null)

  const [selectedTime, setSelectedTime] =
    useState(null)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  // =========================================================
  // PRESELECCIONAR SERVICIO
  // =========================================================

  useEffect(() => {
    if (!services.length) return

    const params =
      new URLSearchParams(
        window.location.search
      )

    const serviceId =
      params.get('service')

    if (!serviceId) return

    const service =
      services.find(
        (item) =>
          String(item.id) ===
          String(serviceId)
      )

    if (service) {
      setSelectedService(service)
    }
  }, [services])

  // =========================================================
  // DÍA DE CIERRE
  // =========================================================

  const isClosedWeekday = (date) => {
    if (!date || !settings) {
      return false
    }

    return (
      date.getDay() ===
      Number(settings.closed_weekday)
    )
  }

  const getClosedDayName = () => {
    const weekday = Number(
      settings?.closed_weekday ?? 0
    )

    return (
      WEEKDAY_NAMES[weekday] ||
      'ese día'
    )
  }

  // =========================================================
  // SELECCIONAR FECHA
  // =========================================================

  const selectDate = async (date) => {
    if (!date) return

    if (isPastDate(date)) {
      return
    }

    if (isClosedWeekday(date)) {
      alert(
        `La barbería permanece cerrada los ${getClosedDayName()}.`
      )
      return
    }

    if (isDateBlocked(date)) {
      alert(
        `Ese día la barbería está cerrada.\n\nMotivo: ${getBlockReason(
          date
        )}`
      )
      return
    }

    setSelectedDate(date)
    setSelectedTime(null)

    // Cargamos las citas de esa fecha.
    await loadForDate(date)
  }

  // =========================================================
  // CAMBIAR MES
  // =========================================================

  const changeMonth = (direction) => {
    const newMonth =
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() +
          direction,
        1
      )

    const minimumMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )

    if (newMonth < minimumMonth) {
      return
    }

    setCurrentMonth(newMonth)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  // =========================================================
  // CAMBIAR SERVICIO
  // =========================================================

  const handleServiceChange = (
    event
  ) => {
    const service =
      services.find(
        (item) =>
          String(item.id) ===
          String(event.target.value)
      )

    setSelectedService(
      service || null
    )

    setSelectedTime(null)
  }

  // =========================================================
  // GUARDAR CITA
  // =========================================================

  const handleBooking = async (
    event
  ) => {
    event.preventDefault()

    if (isSubmitting) return

    if (!selectedService) {
      alert(
        'Selecciona un servicio.'
      )
      return
    }

    if (!selectedDate) {
      alert(
        'Selecciona una fecha.'
      )
      return
    }

    if (!selectedTime) {
      alert(
        'Selecciona una hora.'
      )
      return
    }

    // -------------------------------------------------------
    // VALIDAR FECHA
    // -------------------------------------------------------

    if (isPastDate(selectedDate)) {
      alert(
        'La fecha seleccionada ya no está disponible.'
      )

      setSelectedDate(null)
      setSelectedTime(null)

      return
    }

    // -------------------------------------------------------
    // VALIDAR DÍA CERRADO
    // -------------------------------------------------------

    if (
      isClosedWeekday(
        selectedDate
      )
    ) {
      alert(
        `La barbería permanece cerrada los ${getClosedDayName()}.`
      )

      setSelectedDate(null)
      setSelectedTime(null)

      return
    }

    // -------------------------------------------------------
    // VALIDAR BLOQUEO MANUAL
    // -------------------------------------------------------

    if (
      isDateBlocked(
        selectedDate
      )
    ) {
      alert(
        `Ese día la barbería está cerrada.\n\nMotivo: ${getBlockReason(
          selectedDate
        )}`
      )

      setSelectedDate(null)
      setSelectedTime(null)

      return
    }

    // -------------------------------------------------------
    // VALIDAR HORA
    // -------------------------------------------------------

    if (
      isTimePast(
        selectedTime,
        selectedDate
      )
    ) {
      alert(
        'La hora seleccionada ya ha pasado. Selecciona otra.'
      )

      setSelectedTime(null)

      return
    }

    // -------------------------------------------------------
    // DATOS
    // -------------------------------------------------------

    const formData =
      new FormData(
        event.currentTarget
      )

    const name = String(
      formData.get('name') || ''
    )

    const phone = String(
      formData.get('phone') || ''
    )

    const email = String(
      formData.get('email') || ''
    )

    // -------------------------------------------------------
    // VALIDACIONES
    // -------------------------------------------------------

    const nameCheck =
      validateName(name)

    if (!nameCheck.valid) {
      alert(nameCheck.message)
      return
    }

    const phoneCheck =
      validatePhone(phone)

    if (!phoneCheck.valid) {
      alert(phoneCheck.message)
      return
    }

    const emailCheck =
      validateEmail(email)

    if (!emailCheck.valid) {
      alert(emailCheck.message)
      return
    }

    const appointmentDate =
      formatDateForDatabase(
        selectedDate
      )

    const appointmentTime =
      `${selectedTime}:00`

    setIsSubmitting(true)

    try {
      // -----------------------------------------------------
      // COMPROBAR DISPONIBILIDAD REAL
      // -----------------------------------------------------

      const taken =
        await isSlotTaken(
          appointmentDate,
          appointmentTime
        )

      if (taken) {
        await loadForDate(
          selectedDate
        )

        setSelectedTime(null)

        alert(
          'Esa hora acaba de ser reservada. Por favor, selecciona otra.'
        )

        return
      }

      // -----------------------------------------------------
      // CLIENTE
      // -----------------------------------------------------

      let clientId = null

      const existingClient =
        await findClientByPhone(
          phoneCheck.value
        )

      if (existingClient) {
        clientId =
          existingClient.id

        await updateClient(
          clientId,
          {
            name: nameCheck.value,
            phone: phoneCheck.value,
            email: emailCheck.value,
          }
        )
      } else {
        const newClient =
          await createClient({
            name: nameCheck.value,
            phone: phoneCheck.value,
            email: emailCheck.value,
          })

        clientId =
          newClient.id
      }

      if (!clientId) {
        alert(
          'No se ha podido identificar al cliente.'
        )

        return
      }

      // -----------------------------------------------------
      // CREAR CITA
      // -----------------------------------------------------

      await createAppointment({
        client_id: clientId,
        service_id:
          selectedService.id,

        client_name:
          nameCheck.value,

        client_phone:
          phoneCheck.value,

        client_email:
          emailCheck.value,

        service_name:
          selectedService.name,

        service_price:
          selectedService.price,

        appointment_date:
          appointmentDate,

        appointment_time:
          appointmentTime,

        status: 'pending',

        source: 'web',

        notes: null,
      })

      // -----------------------------------------------------
      // ÉXITO
      // -----------------------------------------------------

      alert(
        `CITA CONFIRMADA\n\n` +
          `Servicio: ${selectedService.name}\n` +
          `Fecha: ${formatDate(selectedDate)}\n` +
          `Hora: ${selectedTime}\n` +
          `Nombre: ${nameCheck.value}\n` +
          `Teléfono: ${phoneCheck.value}\n` +
          `Correo: ${emailCheck.value}\n\n` +
          `La cita se ha guardado correctamente.`
      )

      navigate('/')
    } catch (error) {
      if (error.code === '23505') {
        await loadForDate(
          selectedDate
        )

        setSelectedTime(null)

        alert(
          'Esa hora acaba de ser reservada por otra persona. Selecciona otra.'
        )

        return
      }

      console.error(
        'ERROR GUARDANDO CITA:',
        error
      )

      alert(
        `Ha ocurrido un error al guardar la cita.\n\n${error.message}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="site">
      <Header />

      <div className="booking-page">
        <div className="booking-modal booking-page-card">

          <div className="booking-header">
            <p className="eyebrow">
              {settings?.business_name ||
                'URBAN BARBER'}
            </p>

            <h2>
              RESERVA
              <br />
              TU <em>CITA.</em>
            </h2>

            <p>
              Selecciona tu servicio,
              el día y la hora que
              prefieras.
            </p>
          </div>

          {/* SIN PANTALLA DE CARGA */}
          <AppointmentForm
            services={services}
            servicesLoading={
              servicesLoading
            }

            selectedService={
              selectedService
            }

            onServiceChange={
              handleServiceChange
            }

            currentMonth={
              currentMonth
            }

            onChangeMonth={
              changeMonth
            }

            selectedDate={
              selectedDate
            }

            onSelectDate={
              selectDate
            }

            blockedDaysMap={
              blockedDaysMap
            }

            closedWeekday={
              settings?.closed_weekday
            }

            selectedTime={
              selectedTime
            }

            onSelectTime={
              setSelectedTime
            }

            occupiedTimesLoading={
              occupiedTimesLoading
            }

            slots={
              slotsForDate(
                selectedDate
              )
            }

            isSubmitting={
              isSubmitting
            }

            onSubmit={
              handleBooking
            }
          />

        </div>
      </div>
    </div>
  )
}