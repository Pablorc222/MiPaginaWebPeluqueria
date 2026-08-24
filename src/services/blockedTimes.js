import { supabase } from '../lib/supabase'

// =========================================================
// SERVICIO: HORAS BLOQUEADAS (blocked_times)
//
// Tabla nueva, todavía no creada en Supabase. Columnas
// propuestas:
//   id          bigint, PK
//   date        date              -> "YYYY-MM-DD"
//   time        time              -> "HH:MM:00"
//   reason      text (opcional)
//   created_at  timestamptz default now()
// =========================================================

const TABLE_MISSING_CODE = '42P01'

export async function getBlockedTimes(dateDb) {
  let query = supabase.from('blocked_times').select('*')

  if (dateDb) {
    query = query.eq('date', dateDb)
  }

  const { data, error } = await query.order('time', { ascending: true })

  if (error) {
    if (error.code === TABLE_MISSING_CODE) {
      console.warn(
        'La tabla "blocked_times" todavía no existe en Supabase.'
      )
      return []
    }
    throw error
  }

  return data || []
}

export async function addBlockedTime({ date, time, reason }) {
  const { error } = await supabase
    .from('blocked_times')
    .insert({ date, time, reason: reason || null })

  if (error) throw error
}

export async function removeBlockedTime(blockedTimeId) {
  const { error } = await supabase
    .from('blocked_times')
    .delete()
    .eq('id', blockedTimeId)

  if (error) throw error
}
