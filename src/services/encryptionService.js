import { multiply, divide } from './complexNumberService.js'
import { bytesToBase64, base64ToBytes } from '../utils/helpers.js'

export const EDUCATIONAL_PREFIX = 'cs:edu:v1'
export const SECURE_PREFIX = 'cs:aes:v1'

export class DecryptError extends Error {
  constructor(message) {
    super(message)
    this.name = 'DecryptError'
  }
}

const textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null
const textDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : null

function messageChecksum(message) {
  return Array.from(message).reduce(
    (acc, char) => (acc * 33 + char.codePointAt(0)) % 1000000007,
    7
  )
}

export function ciphertextFormatIsValid(cipherText) {
  if (typeof cipherText !== 'string' || cipherText.trim() === '') return false
  const header = cipherText.split(':')[1]
  return (
    cipherText.startsWith(`${EDUCATIONAL_PREFIX}:`) ||
    cipherText.startsWith(`${SECURE_PREFIX}:`)
  )
}

export function isSecureCipher(cipherText) {
  return typeof cipherText === 'string' && cipherText.startsWith(`${SECURE_PREFIX}:`)
}

export function encryptEducational(message, key) {
  const chars = Array.from(message)
  const keyChars = Array.from(key)
  const pairs = chars.map((char, index) => {
    const code = char.codePointAt(0)
    const keyCode = keyChars[index % keyChars.length].codePointAt(0)
    const keyComplex = { re: keyCode, im: index + 1 }
    const encrypted = multiply({ re: code, im: 0 }, keyComplex)
    return `${encrypted.re}.${encrypted.im}`
  })
  return `${EDUCATIONAL_PREFIX}:${chars.length}:${messageChecksum(message)}:${pairs.join(';')}`
}

export function decryptEducational(cipherText, key) {
  const fail = (context) => {
    throw new DecryptError('La clave es incorrecta o los datos están corruptos.')
  }

  if (typeof cipherText !== 'string' || cipherText.trim() === '') {
    throw new DecryptError('No se recibió ningún mensaje cifrado.')
  }

  const prefix = `${EDUCATIONAL_PREFIX}:`
  if (!cipherText.startsWith(prefix)) {
    throw new DecryptError('El mensaje cifrado no tiene el formato esperado.')
  }

  const rest = cipherText.slice(prefix.length)
  const [lengthField, checksumField, ...payloadParts] = rest.split(':')
  const error = () => fail()

  const expectedLength = Number(lengthField)
  const expectedChecksum = Number(checksumField)
  if (!Number.isInteger(expectedLength) || !Number.isInteger(expectedChecksum)) {
    error()
  }

  const payload = payloadParts.join(':')
  const pairs = payload.split(';')
  if (pairs.length !== expectedLength) error()

  const keyChars = Array.from(key)
  const decoded = pairs.map((pair, index) => {
    const [re, im] = pair.split('.').map(Number)
    if (!Number.isFinite(re) || !Number.isFinite(im)) fail()

    const keyCode = keyChars[index % keyChars.length].codePointAt(0)
    const keyComplex = { re: keyCode, im: index + 1 }
    const original = divide({ re, im }, keyComplex).re
    const code = Math.round(original)
    if (code < 0) fail()
    return String.fromCodePoint(code)
  })

  const plain = decoded.join('')
  if (messageChecksum(plain) !== expectedChecksum) fail()
  return plain
}

function hasWebCrypto() {
  return (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.subtle !== 'undefined' &&
    textEncoder &&
    textDecoder
  )
}

function randomBytes(size) {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
    return globalThis.crypto.getRandomValues(new Uint8Array(size))
  }
  const bytes = new Uint8Array(size)
  for (let i = 0; i < size; i += 1) {
    bytes[i] = Math.floor(Math.random() * 256)
  }
  return bytes
}

async function deriveKey(password, salt) {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptSecure(message, password) {
  if (!hasWebCrypto()) {
    throw new Error('El modo seguro requiere Web Crypto API (HTTPS o localhost).')
  }
  const salt = randomBytes(16)
  const iv = randomBytes(12)
  const key = await deriveKey(password, salt)
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    textEncoder.encode(message)
  )
  const packed = new Uint8Array(encrypted)
  return `${SECURE_PREFIX}:${bytesToBase64(salt)}:${bytesToBase64(iv)}:${bytesToBase64(packed)}`
}

export async function decryptSecure(cipherText, password) {
  if (!hasWebCrypto()) {
    throw new DecryptError('El modo seguro requiere Web Crypto API (HTTPS o localhost).')
  }
  const prefix = `${SECURE_PREFIX}:`
  if (!String(cipherText).startsWith(prefix)) {
    throw new DecryptError('El mensaje cifrado no tiene el formato esperado.')
  }
  const rest = String(cipherText).slice(prefix.length)
  const [saltB64, ivB64, dataB64, ...extra] = rest.split(':')
  if (!saltB64 || !ivB64 || !dataB64 || extra.length > 0) {
    throw new DecryptError('El mensaje cifrado no tiene el formato esperado.')
  }
  let salt
  let iv
  let data
  try {
    salt = base64ToBytes(saltB64)
    iv = base64ToBytes(ivB64)
    data = base64ToBytes(dataB64)
  } catch {
    throw new DecryptError('Los datos del mensaje cifrado son inválidos.')
  }
  try {
    const key = await deriveKey(password, salt)
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
    return textDecoder.decode(plain)
  } catch {
    throw new DecryptError('La clave es incorrecta o los datos están corruptos.')
  }
}