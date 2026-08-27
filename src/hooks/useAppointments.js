import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getAppointments,
  updateAppointmentStatus as updateStatusService,
  deleteAppointment as deleteAppointmentService,
} from '../services/appointments'
import { getTodayForDatabase } from '../utils/dates'

const REFRESH_INTERVAL_MS = 30000

// Carga y gestiona las citas del panel de administración.
// Las nuevas citas se crean directamente como CONFIRMADAS.
// El refresco automático mantiene la agenda actualizada.
export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // =========================================================
  // CARGAR CITAS
  // =========================================================

  const refetch = useCallback(async () => {
    setLoading(true)

    try {
      const data = await getAppointments()

      setAppointments(data)
    } catch (error) {
      console.error('ERROR CARGANDO CITAS:', error)

      setAppointments([])

      alert(
        `No se han podido cargar las citas.\n\n${error.message}`
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {
    refetch()
  }, [refetch])

  // =========================================================
  // REFRESCO AUTOMÁTICO
  // =========================================================

  useEffect(() => {
    const interval = setInterval(
      refetch,
      REFRESH_INTERVAL_MS
    )

    return () => {
      clearInterval(interval)
    }
  }, [refetch])

  // =========================================================
  // ESTADÍSTICAS
  // =========================================================

  const stats = useMemo(() => {
    const today = getTodayForDatabase()

    const count = (predicate) =>
      appointments.filter(predicate).length

    return {
      total: appointments.length,

      today: count(
        (appointment) =>
          appointment.appointment_date === today
      ),

      // Se mantiene por compatibilidad,
      // pero las nuevas citas ya no deberían
      // entrar como pending.
      pending: count(
        (appointment) =>
          appointment.status === 'pending'
      ),

      confirmed: count(
        (appointment) =>
          appointment.status === 'confirmed'
      ),

      completed: count(
        (appointment) =>
          appointment.status === 'completed'
      ),

      cancelled: count(
        (appointment) =>
          appointment.status === 'cancelled'
      ),
    }
  }, [appointments])

  // =========================================================
  // ACTUALIZAR ESTADO
  // =========================================================

  const updateStatus = async (
    appointment,
    newStatus
  ) => {
    if (!appointment?.id) {
      return false
    }

    setSaving(true)

    try {
      await updateStatusService(
        appointment.id,
        newStatus
      )

      await refetch()

      return true
    } catch (error) {
      console.error(
        'ERROR ACTUALIZANDO CITA:',
        error
      )

      alert(
        `No se ha podido actualizar la cita.\n\n${error.message}`
      )

      return false
    } finally {
      setSaving(false)
    }
  }

  // =========================================================
  // ELIMINAR CITA
  // =========================================================

  const removeAppointment = async (
    appointment
  ) => {
    if (!appointment?.id) {
      return false
    }

    setSaving(true)

    try {
      await deleteAppointmentService(
        appointment.id
      )

      setAppointments((current) =>
        current.filter(
          (item) =>
            item.id !== appointment.id
        )
      )

      return true
    } catch (error) {
      console.error(
        'ERROR ELIMINANDO CITA:',
        error
      )

      alert(
        `No se ha podido eliminar la cita.\n\n${error.message}`
      )

      return false
    } finally {
      setSaving(false)
    }
  }

  // =========================================================
  // RETURN
  // =========================================================

  return {
    appointments,
    loading,
    saving,
    stats,
    refetch,
    updateStatus,
    removeAppointment,
  }
}
