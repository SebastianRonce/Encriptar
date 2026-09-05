export const CATEGORIES = {
  MUY_DEBIL: { label: 'Muy débil', min: 0, color: '#f87171' },
  DEBIL: { label: 'Débil', min: 20, color: '#fb923c' },
  REGULAR: { label: 'Regular', min: 40, color: '#fbbf24' },
  BUENA: { label: 'Buena', min: 60, color: '#a3e635' },
  FUERTE: { label: 'Fuerte', min: 75, color: '#34d399' },
  EXCELENTE: { label: 'Excelente', min: 90, color: '#22d3ee' }
}

export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
export const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const DIGITS = '0123456789'
export const SPECIAL_CHARS = '!@#$%^&*()-_=+[]{};:,.<>?/~'
const AMBIGUOUS_CHARS = 'l1IO0'

export const COMMON_PASSWORDS = new Set([
  '123456',
  'password',
  '12345678',
  'qwerty',
  '123456789',
  '12345',
  '1234',
  '111111',
  '1234567',
  'dragon',
  '123123',
  'baseball',
  'abc123',
  'football',
  'monkey',
  'letmein',
  'shadow',
  'master',
  '666666',
  'qwertyuiop',
  '123321',
  'mustang',
  '1234567890',
  'michael',
  '654321',
  'pussy',
  'superman',
  '1qaz2wsx',
  '7777777',
  '121212',
  '000000',
  'qazwsx',
  '123qwe',
  'killer',
  'trustno1',
  'jordan',
  'jennifer',
  'zxcvbnm',
  'asdfgh',
  'hunter',
  'buster',
  'soccer',
  'harley',
  'batman',
  'andrew',
  'tigger',
  'sunshine',
  'iloveyou',
  'fuckyou',
  '2000',
  'charlie',
  'robert',
  'thomas',
  'hannah'
])

const KEYBOARD_SEQUENCES = [
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
  '1234567890',
  '0987654321',
  'qwe',
  'wer',
  'ert',
  'rty',
  'tyu',
  'yui',
  'uio',
  'iop',
  'asd',
  'sdf',
  'dfg',
  'fgh',
  'ghj',
  'hjk',
  'jkl',
  'zxc',
  'xcv',
  'cvb',
  'vbn',
  'bnm',
  'qaz',
  'wsx',
  'edc',
  'rfv',
  'tgb',
  'yhn',
  'ujm',
  'wsxedc',
  'qazwsx',
  '1qaz',
  '2wsx',
  '3edc',
  '4rfv',
  '5tgb',
  '6yhn',
  '7ujm',
  '789456123',
  '741852963',
  '147258369',
  '159357',
  'abc',
  'bcd',
  'cde',
  'def',
  'efg',
  'fgh',
  'ghi',
  'hij',
  'ijk',
  'jkl',
  'klm',
  'lmn',
  'mno',
  'nop',
  'opq',
  'pqr',
  'qrs',
  'rst',
  'stu',
  'tuv',
  'uvw',
  'vwx',
  'wxy',
  'xyz',
  'cba',
  '321'
]

function hasConsecutiveRepeat(password) {
  return /(.)\1{2,}/.test(password)
}

function hasSequence(password) {
  const lower = password.toLowerCase()
  for (let i = 0; i <= lower.length - 3; i += 1) {
    const window = lower.slice(i, i + 3)
    if (KEYBOARD_SEQUENCES.includes(window)) return true
    const codes = Array.from(window).map((ch) => ch.codePointAt(0))
    if (codes[1] === codes[0] + 1 && codes[2] === codes[1] + 1) return true
    if (codes[1] === codes[0] - 1 && codes[2] === codes[1] - 1) return true
  }
  return false
}

function uniqueCharRatio(password) {
  const unique = new Set(Array.from(password)).size
  return unique / Array.from(password).length
}

export function analyzePassword(password) {
  const empty = {
    strength: 0,
    category: 'MUY_DEBIL',
    checks: [],
    warnings: [],
    recommendations: []
  }

  if (!password) return empty
  const normalized = String(password)
  const length = Array.from(normalized).length

  const hasUppercase = /[A-Z]/.test(normalized)
  const hasLowercase = /[a-z]/.test(normalized)
  const hasDigit = /\d/.test(normalized)
  const hasSpecial = /[^A-Za-z0-9]/.test(normalized)
  const isCommon = COMMON_PASSWORDS.has(normalized.toLowerCase())
  const repeat = hasConsecutiveRepeat(normalized)
  const sequence = hasSequence(normalized)
  const uniqueRatio = uniqueCharRatio(normalized)

  const checks = [
    { label: 'Tiene 8 caracteres o más', ok: length >= 8 },
    { label: 'Tiene 12 caracteres o más (ideal)', ok: length >= 12 },
    { label: 'Contiene letras mayúsculas', ok: hasUppercase },
    { label: 'Contiene letras minúsculas', ok: hasLowercase },
    { label: 'Contiene números', ok: hasDigit },
    { label: 'Contiene caracteres especiales', ok: hasSpecial },
    { label: 'No repite caracteres en exceso', ok: !repeat && uniqueRatio >= 0.5 },
    { label: 'No usa secuencias ni patrones fáciles', ok: !sequence },
    { label: 'No es una contraseña muy común', ok: !isCommon }
  ]

  const warnings = []
  if (isCommon) warnings.push('Esta contraseña aparece en listas de contraseñas conocidas.')
  if (length < 6) warnings.push('Es extremadamente corta: se descifra en segundos.')
  if (repeat) warnings.push('Repite caracteres consecutivos, lo que la hace más predecible.')
  if (sequence) warnings.push('Usa secuencias o patrones de teclado fáciles de adivinar.')

  let strength = 0
  strength += Math.min(30, Math.max(0, (length - 4) * 2.5))
  strength += hasLowercase ? 6 : 0
  strength += hasUppercase ? 6 : 0
  strength += hasDigit ? 6 : 0
  strength += hasSpecial ? 8 : 0
  strength += uniqueRatio === 1 ? 4 : 0
  strength += !repeat ? 4 : 0
  strength += !sequence ? 6 : 0
  strength += !isCommon ? 15 : 0
  strength += length >= 12 ? 9 : 0

  if (isCommon || length <= 5) strength = Math.min(strength, 10)
  strength = Math.min(100, Math.max(0, Math.round(strength)))

  const categoryKey = Object.keys(CATEGORIES)
    .filter((key) => strength >= CATEGORIES[key].min)
    .reduce((best, key) => (CATEGORIES[key].min > CATEGORIES[best].min ? key : best), 'MUY_DEBIL')

  const recommendations = buildRecommendations({
    normalized,
    length,
    hasUppercase,
    hasLowercase,
    hasDigit,
    hasSpecial,
    isCommon,
    repeat,
    sequence,
    categoryKey
  })

  return { strength, category: categoryKey, checks, warnings, recommendations }
}

function buildRecommendations(analysis) {
  const { categoryKey, length, hasUppercase, hasLowercase, hasDigit, hasSpecial, isCommon, repeat, sequence, normalized } = analysis
  const items = []

  if (categoryKey === 'MUY_DEBIL' || categoryKey === 'DEBIL' || categoryKey === 'REGULAR' || categoryKey === 'BUENA') {
    if (length < 12) items.push('Usa al menos 12 caracteres; cuanto más larga, mejor.')
    if (length < 8) items.push('Las contraseñas de menos de 8 caracteres se descifran muy rápido.')
    if (!hasUppercase) items.push('Agrega letras mayúsculas (A-Z).')
    if (!hasLowercase) items.push('Agrega letras minúsculas (a-z).')
    if (!hasDigit) items.push('Agrega números (0-9).')
    if (!hasSpecial) items.push('Agrega caracteres especiales como ! @ # $ %.')
    if (isCommon) items.push('Evita contraseñas conocidas que aparecen en listas públicas.')
    if (sequence) items.push('Evita secuencias como 123456, abcdef o patrones de teclado (qwerty).')
    if (repeat) items.push('Evita caracteres repetidos tres o más veces seguidas.')
    items.push('No uses información personal (tu nombre, fecha de nacimiento, correo).')
    items.push('Usa una frase o combinación de palabras sin relación entre sí.')
  }

  if ((categoryKey === 'FUERTE' || categoryKey === 'EXCELENTE') && items.length === 0) {
    return [
      'No reutilices esta contraseña en otros sitios.',
      'Guárdala en un gestor de contraseñas.',
      'Activa la autenticación multifactor (2FA) cuando esté disponible.'
    ]
  }
  return items
}

export function classifyByStrength(strength) {
  return Object.entries(CATEGORIES)
    .filter(([, config]) => strength >= config.min)
    .sort((a, b) => b[1].min - a[1].min)[0]?.[0] || 'MUY_DEBIL'
}

export function generatePassword(options = {}) {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    digits = true,
    special = false,
    excludeAmbiguous = false
  } = options

  const selectedGroups = []
  if (lowercase) selectedGroups.push(LOWERCASE)
  if (uppercase) selectedGroups.push(UPPERCASE)
  if (digits) selectedGroups.push(DIGITS)
  if (special) selectedGroups.push(specialExcluded(SPECIAL_CHARS, excludeAmbiguous))

  if (selectedGroups.length === 0) {
    throw new Error('Selecciona al menos una categoría de caracteres.')
  }

  let charset = selectedGroups.join('')
  if (excludeAmbiguous) {
    charset = Array.from(charset).filter((ch) => !AMBIGUOUS_CHARS.includes(ch)).join('')
  }

  const finalLength = Math.min(128, Math.max(1, Math.round(length)))
  if (finalLength < selectedGroups.length) {
    throw new Error('La longitud debe ser al menos igual al número de categorías seleccionadas.')
  }

  const chosen = []
  selectedGroups.forEach((group) => {
    let pool = group
    if (excludeAmbiguous) {
      pool = Array.from(group).filter((ch) => !AMBIGUOUS_CHARS.includes(ch)).join('')
    }
    chosen.push(pool[secureIndex(pool.length)])
  })

  while (chosen.length < finalLength) {
    chosen.push(charset[secureIndex(charset.length)])
  }

  for (let i = chosen.length - 1; i > 0; i -= 1) {
    const j = secureIndex(i + 1)
    const temp = chosen[i]
    chosen[i] = chosen[j]
    chosen[j] = temp
  }

  return chosen.join('')
}

function specialExcluded(chars, excludeAmbiguous) {
  if (!excludeAmbiguous) return chars
  return Array.from(chars).filter((ch) => !AMBIGUOUS_CHARS.includes(ch)).join('')
}

function secureIndex(max) {
  const byteLimit = 256 - (256 % max)
  const bytes = new Uint8Array(4)
  let value = byteLimit
  while (value >= byteLimit) {
    crypto.getRandomValues(bytes)
    value = bytes[0]
  }
  return value % max
}