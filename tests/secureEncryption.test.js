import { describe, it, expect } from 'vitest'
import {
  encryptSecure,
  decryptSecure,
  DecryptError,
  isSecureCipher,
  ciphertextFormatIsValid
} from '../src/services/encryptionService.js'

const hasWebCrypto =
  typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.subtle !== 'undefined'

describe('Cifrado seguro con AES-GCM (Web Crypto API)', () => {
  it.runIf(hasWebCrypto)('descifra correctamente lo que cifró', async () => {
    const message = 'Esto es un mensaje confidencial 🚀'
    const pwd = 'MiClave-Super-Segura-2026!'
    const cipher = await encryptSecure(message, pwd)
    expect(await decryptSecure(cipher, pwd)).toBe(message)
  })

  it.runIf(hasWebCrypto)('el formato seguro se identifica correctamente', async () => {
    const cipher = await encryptSecure('hola', 'clave12345')
    expect(isSecureCipher(cipher)).toBe(true)
    expect(ciphertextFormatIsValid(cipher)).toBe(true)
  })

  it.runIf(hasWebCrypto)('lanza error si la clave es incorrecta', async () => {
    const cipher = await encryptSecure('mensaje', 'clave-correcta-2026')
    await expect(decryptSecure(cipher, 'clave-incorrecta')).rejects.toBeInstanceOf(DecryptError)
  })

  it.runIf(hasWebCrypto)('lanza error si el formato no es válido', async () => {
    await expect(decryptSecure('no-soy-cifrado', 'clave')).rejects.toThrow(DecryptError)
  })

  it.runIf(hasWebCrypto)('genera un IV/sal aleatorio distinto en cada cifrado', async () => {
    const pwd = 'mismaClave'
    const a = await encryptSecure('mensaje', pwd)
    const b = await encryptSecure('mensaje', pwd)
    expect(a).not.toBe(b)
  })

  it.skipIf(hasWebCrypto)('se omite si Web Crypto no está disponible', () => {
    expect(true).toBe(true)
  })
})