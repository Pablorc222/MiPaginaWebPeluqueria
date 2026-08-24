import { supabase } from '../lib/supabase'

// =========================================================
// SERVICIO: DÍAS BLOQUEADOS (blocked_days)
//
// Tabla nueva, todavía no creada en Supabase (ver hoja de
// ruta). Columnas propuestas:
//   id          bigint, PK
//   date        date              -> "YYYY-MM-DD"
//   reason      text (opcional)   -> ej. "Vacaciones"
//   created_at  timestamptz default now()
//
// Estas funciones no rompen la app si la tabla aún no
// existe: devuelven una lista vacía / avisan por consola.
// =========================================================

const TABLE_MISSING_CODE = '42P01'

export async function getBlockedDays() {
  const { data, error } = await supabase
    .from('blocked_days')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    if (error.code === TABLE_MISSING_CODE) {
      console.warn(
        'La tabla "blocked_days" todavía no existe en Supabase.'
      )
      return []
    }
    throw error
  }

  return data || []
}

export async function addBlockedDay({ date, reason }) {
  const { error } = await supabase
    .from('blocked_days')
    .insert({ date, reason: reason || null })

  if (error) throw error
}

export async function removeBlockedDay(blockedDayId) {
  const { error } = await supabase
    .from('blocked_days')
    .delete()
    .eq('id', blockedDayId)

  if (error) throw error
}
