import { supabase } from '../lib/supabase'

// =========================================================
// SERVICIO: SERVICIOS DE LA BARBERÍA (services)
// =========================================================

export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('id', { ascending: true })

  if (error) throw error

  return data || []
}

export async function createService({ name, description, price }) {
  const { error } = await supabase
    .from('services')
    .insert({ name, description, price })

  if (error) throw error
}

export async function updateService(serviceId, { name, description, price }) {
  const { error } = await supabase
    .from('services')
    .update({ name, description, price })
    .eq('id', serviceId)

  if (error) throw error
}

export async function deleteService(serviceId) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', serviceId)

  if (error) throw error
}
