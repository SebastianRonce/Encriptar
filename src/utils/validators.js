export const MAX_MESSAGE_LENGTH = 5000
export const MIN_KEY_LENGTH = 4
export const MAX_KEY_LENGTH = 128
export const MAX_PASSWORD_LENGTH = 200

export const isEmpty = (value) =>
  value === undefined || value === null || String(value).trim() === ''

export const codePointLength = (value) => Array.from(value).length

export function validateEncryptionInput(message, key) {
  if (isEmpty(message)) {
    return { valid: false, error: 'Escribe un mensaje para cifrar.' }
  }
  if (codePointLength(message) > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `El mensaje es demasiado largo. Máximo ${MAX_MESSAGE_LENGTH} caracteres.`
    }
  }
  if (isEmpty(key)) {
    return { valid: false, error: 'Escribe una clave para el cifrado.' }
  }
  if (codePointLength(key) < MIN_KEY_LENGTH) {
    return {
      valid: false,
      error: `La clave es demasiado corta. Usa al menos ${MIN_KEY_LENGTH} caracteres.`
    }
  }
  if (codePointLength(key) > MAX_KEY_LENGTH) {
    return {
      valid: false,
      error: `La clave es demasiado larga. Máximo ${MAX_KEY_LENGTH} caracteres.`
    }
  }
  return { valid: true }
}

export function validateDecryptionInput(cipherText, key) {
  if (isEmpty(cipherText)) {
    return { valid: false, error: 'Pega aquí el mensaje cifrado para descifrarlo.' }
  }
  if (codePointLength(cipherText) > MAX_MESSAGE_LENGTH * 24) {
    return { valid: false, error: 'El mensaje cifrado es demasiado largo o no es válido.' }
  }
  if (isEmpty(key)) {
    return { valid: false, error: 'Escribe la clave con la que se cifró el mensaje.' }
  }
  if (codePointLength(key) < MIN_KEY_LENGTH) {
    return {
      valid: false,
      error: `La clave es demasiado corta. Usa al menos ${MIN_KEY_LENGTH} caracteres.`
    }
  }
  if (codePointLength(key) > MAX_KEY_LENGTH) {
    return {
      valid: false,
      error: `La clave es demasiado larga. Máximo ${MAX_KEY_LENGTH} caracteres.`
    }
  }
  return { valid: true }
}

export function validateComplexInput(real, imaginary) {
  if (isEmpty(real) || isEmpty(imaginary)) {
    return { valid: false, error: 'Escribe la parte real y la parte imaginaria.' }
  }
  if (Number.isNaN(Number(real)) || Number.isNaN(Number(imaginary))) {
    return { valid: false, error: 'La parte real y la imaginaria deben ser números.' }
  }
  return { valid: true }
}