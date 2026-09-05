import { describe, it, expect } from 'vitest'
import {
  encryptEducational,
  decryptEducational,
  DecryptError,
  ciphertextFormatIsValid
} from '../src/services/encryptionService.js'
import { validateEncryptionInput, validateDecryptionInput } from '../src/utils/validators.js'

describe('Cifrado educativo con números complejos', () => {
  it('descifrar(cifrar(mensaje, clave), clave) === mensaje', () => {
    const message = 'Hola CryptoSafe 2026 👋'
    const key = 'miClaveSecreta'
    const cipher = encryptEducational(message, key)
    expect(decryptEducational(cipher, key)).toBe(message)
  })

  it('mantiene acentos y emojis (UTF-8 completo)', () => {
    const message = 'áéíóú ñ ü ÄΩ → 🚀'
    const key = 'cl4ve-fuerte!'
    const cipher = encryptEducational(message, key)
    expect(decryptEducational(cipher, key)).toBe(message)
  })

  it('genera un texto cifrado con el prefijo esperado', () => {
    const cipher = encryptEducational('test', 'clave123')
    expect(cipher).toMatch(/^cs:edu:v1:/)
    expect(ciphertextFormatIsValid(cipher)).toBe(true)
  })

  it('lanza error si la clave es incorrecta', () => {
    const cipher = encryptEducational('mensaje secreto', 'clave-correcta')
    expect(() => decryptEducational(cipher, 'clave-incorrecta')).toThrow(DecryptError)
  })

  it('lanza error si los datos están corruptos', () => {
    const cipher = encryptEducational('mensaje', 'clave1234')
    const corrupted = cipher.slice(0, -4) + '9999'
    expect(() => decryptEducational(corrupted, 'clave1234')).toThrow(DecryptError)
  })

  it('lanza error con input vacío', () => {
    expect(() => decryptEducational('', 'clave')).toThrow(DecryptError)
    expect(() => decryptEducational(null, 'clave')).toThrow(DecryptError)
  })

  it('lanza error si el formato no es reconocido', () => {
    expect(() => decryptEducational('not-a-cipher', 'clave')).toThrow(DecryptError)
  })

  it('descifra correctamente con claves de distinta longitud que el mensaje', () => {
    const message = 'mensaje largo para probar claves cortas y diferentes longitudes'
    const result = decryptEducational(encryptEducational(message, 'pe'), 'pe')
    expect(result).toBe(message)
  })
})

describe('Validaciones de cifrado/descifrado', () => {
  it('rechaza campos vacíos', () => {
    expect(validateEncryptionInput('', 'clave').valid).toBe(false)
    expect(validateEncryptionInput('mensaje', '').valid).toBe(false)
  })

  it('rechaza claves muy cortas', () => {
    expect(validateEncryptionInput('mensaje', 'abc').valid).toBe(false)
    expect(validateEncryptionInput('mensaje', 'abcd').valid).toBe(true)
  })

  it('rechaza mensajes demasiado grandes', () => {
    const huge = 'x'.repeat(5001)
    expect(validateEncryptionInput(huge, 'clave1234').valid).toBe(false)
  })

  it('rechaza mensajes cifrados vacíos', () => {
    expect(validateDecryptionInput('', 'clave').valid).toBe(false)
  })
})