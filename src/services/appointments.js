import { supabase } from '../lib/supabase'

// =========================================================
// SERVICIO: CITAS (appointments)
//
// Toda consulta a Supabase relacionada con citas pasa por
// aquí. Antes estaba repartida entre App.jsx y AdminApp.jsx.
// =========================================================

function normalizeAppointment(appointment) {
  if (!appointment) return null

  const client = Array.isArray(appointment.clients)
    ? appointment.clients[0]
    : appointment.clients

  const service = Array.isArray(appointment.services)
    ? appointment.services[0]
    : appointment.services

  return {
    ...appointment,
    client_name: appointment.client_name || client?.name || '',
    client_phone: appointment.client_phone || client?.phone || '',
    client_email: appointment.client_email || client?.email || '',
    service_name: appointment.service_name || service?.name || '',
    service_description:
      appointment.service_description || service?.description || '',
    service_price:
      appointment.service_price ?? service?.price ?? '',
  }
}

// Usado por el panel admin: trae todas las citas con datos
// de cliente y servicio ya "aplanados".
export async function getAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select(
      `*, clients ( id, name, phone, email ), services ( id, name, description, price )`
    )
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })

  if (error) throw error

  return (data || []).map(normalizeAppointment)
}

// Usado por la reserva pública: qué horas están ya cogidas
// para un día concreto.
export async function getOccupiedTimes(appointmentDateDb) {
  const { data, error } = await supabase
    .from('appointments')
    .select('appointment_time')
    .eq('appointment_date', appointmentDateDb)
    .neq('status', 'cancelled')

  if (error) throw error

  return (data || []).map((appointment) =>
    String(appointment.appointment_time).slice(0, 5)
  )
}

// Comprueba si una fecha+hora concretas ya tienen una cita activa
export async function isSlotTaken(appointmentDateDb, appointmentTimeDb) {
  const { data, error } = await supabase
    .from('appointments')
    .select('id')
    .eq('appointment_date', appointmentDateDb)
    .eq('appointment_time', appointmentTimeDb)
    .neq('status', 'cancelled')
    .limit(1)

  if (error) throw error

  return Boolean(data && data.length > 0)
}

export async function createAppointment(appointmentData) {
  const { error } = await supabase
    .from('appointments')
    .insert(appointmentData)

  if (error) throw error
}

export async function updateAppointmentStatus(appointmentId, newStatus) {
  const { error } = await supabase
    .from('appointments')
    .update({ status: newStatus })
    .eq('id', appointmentId)

  if (error) throw error
}

export async function deleteAppointment(appointmentId) {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId)

  if (error) throw error
}

export { normalizeAppointment }
