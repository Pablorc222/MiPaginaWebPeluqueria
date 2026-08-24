// =========================================================
// VALIDACIONES
// Antes vivían inline dentro de handleBooking() en App.jsx
// =========================================================

export function validateName(name) {
  const clean = String(name || '').trim()

  if (!clean) {
    return { valid: false, message: 'Introduce tu nombre.' }
  }

  if (clean.length < 2) {
    return { valid: false, message: 'Introduce un nombre válido.' }
  }

  return { valid: true, value: clean }
}

// Teléfonos españoles de 9 dígitos (6,7,8,9 inicial)
export function validatePhone(phone) {
  const raw = String(phone || '').trim()

  if (!raw) {
    return { valid: false, message: 'Introduce tu teléfono.' }
  }

  const clean = raw.replace(/[\s.-]/g, '')
  const phoneRegex = /^[6789]\d{8}$/

  if (!phoneRegex.test(clean)) {
    return {
      valid: false,
      message:
        'Introduce un número de teléfono español válido de 9 dígitos.',
    }
  }

  return { valid: true, value: clean }
}

export function validateEmail(email) {
  const clean = String(email || '').trim()

  if (!clean) {
    return { valid: false, message: 'Introduce tu correo electrónico.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  if (!emailRegex.test(clean)) {
    return {
      valid: false,
      message:
        'Introduce un correo electrónico válido. Ejemplo: nombre@gmail.com',
    }
  }

  return { valid: true, value: clean }
}

export function validateServicePrice(price) {
  const value = Number(price)

  if (Number.isNaN(value) || value < 0) {
    return { valid: false, message: 'Introduce un precio válido.' }
  }

  return { valid: true, value }
}
