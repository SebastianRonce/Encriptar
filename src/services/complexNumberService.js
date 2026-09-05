export function toComplex(real, imaginary = 0) {
  return { re: Number(real) || 0, im: Number(imaginary) || 0 }
}

export function add(a, b) {
  return { re: a.re + b.re, im: a.im + b.im }
}

export function subtract(a, b) {
  return { re: a.re - b.re, im: a.im - b.im }
}

export function multiply(a, b) {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re
  }
}

export function divide(a, b) {
  const denominator = b.re * b.re + b.im * b.im
  if (denominator === 0) {
    throw new Error('No se puede dividir entre cero.')
  }
  return {
    re: (a.re * b.re + a.im * b.im) / denominator,
    im: (a.im * b.re - a.re * b.im) / denominator
  }
}

export function modulus(z) {
  return Math.hypot(z.re, z.im)
}

export function conjugate(z) {
  return { re: z.re, im: -z.im }
}

export function argument(z) {
  return Math.atan2(z.im, z.re)
}

export function isEquivalent(a, b, tolerance = 1e-9) {
  return (
    Math.abs(a.re - b.re) <= tolerance && Math.abs(a.im - b.im) <= tolerance
  )
}

export function toDisplayString(z) {
  const re = z.re
  const im = z.im
  const reIsZero = Math.abs(re) < 1e-9
  const imIsZero = Math.abs(im) < 1e-9

  if (reIsZero && imIsZero) return '0'

  const sign = im < 0 ? '-' : '+'
  const absIm = Math.abs(im)

  if (imIsZero) return `${re}`
  if (reIsZero) return `${im}i`
  if (Math.abs(absIm - 1) < 1e-9) return `${re} ${sign} i`
  return `${re} ${sign} ${absIm}i`
}

export function fromPolar(mod, angle) {
  return { re: mod * Math.cos(angle), im: mod * Math.sin(angle) }
}

export const formatNumber = (value, digits = 3) => {
  const rounded = Math.abs(value - Math.round(value)) < 1e-9 ? Math.round(value) : value
  return Number(rounded.toFixed(digits)).toString()
}