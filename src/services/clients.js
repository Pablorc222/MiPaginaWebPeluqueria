import { supabase } from '../lib/supabase'

// =========================================================
// SERVICIO: CLIENTES (clients)
// =========================================================

export async function getClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error

  return data || []
}

export async function findClientByPhone(phone) {
  const { data, error } = await supabase
    .from('clients')
    .select('id')
    .eq('phone', phone)
    .limit(1)

  if (error) throw error

  return data && data.length > 0 ? data[0] : null
}

export async function createClient({ name, phone, email }) {
  const { data, error } = await supabase
    .from('clients')
    .insert({ name, phone, email })
    .select('id')
    .single()

  if (error) throw error

  return data
}

export async function updateClient(clientId, { name, phone, email }) {
  const { error } = await supabase
    .from('clients')
    .update({ name, phone, email })
    .eq('id', clientId)

  if (error) throw error
}
