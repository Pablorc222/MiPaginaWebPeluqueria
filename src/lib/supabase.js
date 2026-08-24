import { createClient } from '@supabase/supabase-js'

// =========================================================
// CLIENTE ÚNICO DE SUPABASE
//
// Toda la app (web pública + panel admin) usa este mismo
// cliente. Antes había uno duplicado en /admin y otro en /src.
// =========================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
  throw new Error(
    'Falta VITE_SUPABASE_URL en el archivo .env.local'
  )
}

if (!supabasePublishableKey) {
  throw new Error(
    'Falta VITE_SUPABASE_PUBLISHABLE_KEY en el archivo .env.local'
  )
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
)
