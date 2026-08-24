import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getAppointments,
  updateAppointmentStatus as updateStatusService,
  deleteAppointment as deleteAppointmentService,
} from '../services/appointments'
import { getTodayForDatabase } from '../utils/dates'

const REFRESH_INTERVAL_MS = 30000

// Carga y gestiona las citas para el panel admin: refresco
// automático cada 30s, estadísticas y acciones de cambio de
// estado / borrado.
export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const refetch = useCallback(async () => {
    setLoading(true)

    try {
      const data = await getAppointments()
      setAppointments(data)
    } catch (error) {
      console.error('ERROR CARGANDO CITAS:', error)
      setAppointments([])
      alert(`No se han podido cargar las citas.\n\n${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    const interval = setInterval(refetch, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [refetch])

  const stats = useMemo(() => {
    const today = getTodayForDatabase()

    const count = (predicate) => appointments.filter(predicate).length

    return {
      total: appointments.length,
      today: count((a) => a.appointment_date === today),
      pending: count((a) => a.status === 'pending'),
      confirmed: count((a) => a.status === 'confirmed'),
      completed: count((a) => a.status === 'completed'),
      cancelled: count((a) => a.status === 'cancelled'),
    }
  }, [appointments])

  const updateStatus = async (appointment, newStatus) => {
    if (!appointment?.id) return false

    setSaving(true)

    try {
      await updateStatusService(appointment.id, newStatus)
      await refetch()
      return true
    } catch (error) {
      console.error('ERROR ACTUALIZANDO CITA:', error)
      alert(`No se ha podido actualizar la cita.\n\n${error.message}`)
      return false
    } finally {
      setSaving(false)
    }
  }

  const removeAppointment = async (appointment) => {
    if (!appointment?.id) return false

    setSaving(true)

    try {
      await deleteAppointmentService(appointment.id)
      setAppointments((current) =>
        current.filter((item) => item.id !== appointment.id)
      )
      return true
    } catch (error) {
      console.error('ERROR ELIMINANDO CITA:', error)
      alert(`No se ha podido eliminar la cita.\n\n${error.message}`)
      return false
    } finally {
      setSaving(false)
    }
  }

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
