import { supabase } from '../lib/supabase'

const TABLE_MISSING_CODE = '42P01'

export const DEFAULT_SETTINGS = {
  business_name: 'Urban Barber',
  opening_time: '10:00',
  closing_time: '20:00',
  closed_weekday: 0,
}

export async function getSettings() {
  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (error) {
    if (error.code === TABLE_MISSING_CODE) {
      console.warn('La tabla "business_settings" no existe todavía.')
      return DEFAULT_SETTINGS
    }

    throw error
  }

  return data || DEFAULT_SETTINGS
}

export async function updateSettings(settings) {
  const cleanSettings = {
    id: 1,
    business_name: settings.business_name,
    opening_time: settings.opening_time,
    closing_time: settings.closing_time,
    closed_weekday: Number(settings.closed_weekday),
  }

  const { error } = await supabase
    .from('business_settings')
    .upsert(cleanSettings, { onConflict: 'id' })

  if (error) throw error
}