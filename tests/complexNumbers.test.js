import { describe, it, expect } from 'vitest'
import {
  toComplex,
  add,
  subtract,
  multiply,
  divide,
  modulus,
  conjugate,
  argument,
  toDisplayString,
  fromPolar,
  isEquivalent
} from '../src/services/complexNumberService.js'

const z1 = toComplex(3, 4)
const z2 = toComplex(1, -2)

describe('Números complejos', () => {
  it('suma dos complejos', () => {
    expect(add(z1, z2)).toEqual({ re: 4, im: 2 })
  })

  it('resta dos complejos', () => {
    expect(subtract(z1, z2)).toEqual({ re: 2, im: 6 })
  })

  it('multiplica dos complejos: (a+bi)(c+di) = (ac-bd) + (ad+bc)i', () => {
    const result = multiply(z1, z2)
    expect(result.re).toBeCloseTo(11) // 3*1 - 4*(-2)
    expect(result.im).toBeCloseTo(-2) // 3*(-2) + 4*1
  })

  it('divide dos complejos', () => {
    const result = divide(z1, z2)
    const recon = multiply(result, z2)
    expect(recon.re).toBeCloseTo(z1.re)
    expect(recon.im).toBeCloseTo(z1.im)
  })

  it('lanza error al dividir entre cero', () => {
    expect(() => divide(z1, toComplex(0, 0))).toThrow(/cero/)
  })

  it('calcula el módulo: √(3² + 4²) = 5', () => {
    expect(modulus(z1)).toBeCloseTo(5)
  })

  it('calcula el conjugado', () => {
    expect(conjugate(z1)).toEqual({ re: 3, im: -4 })
  })

  it('calcula el argumento en la posición correcta del plano', () => {
    expect(argument(toComplex(1, 0))).toBeCloseTo(0)
    expect(argument(toComplex(0, 1))).toBeCloseTo(Math.PI / 2)
    expect(argument(toComplex(1, 1))).toBeCloseTo(Math.PI / 4)
  })

  it('convierte de forma polar a rectangular', () => {
    const rt = fromPolar(5, Math.PI / 2)
    expect(rt.re).toBeCloseTo(0)
    expect(rt.im).toBeCloseTo(5)
  })

  it('verifica que multiplicar se puede invertir con divide', () => {
    const product = multiply(z1, z2)
    const back = divide(product, z2)
    expect(isEquivalent(back, z1)).toBe(true)
  })

  it('formatea la representación a + bi', () => {
    expect(toDisplayString(toComplex(3, 4))).toBe('3 + 4i')
    expect(toDisplayString(toComplex(3, -1))).toBe('3 - i')
    expect(toDisplayString(toComplex(0, 5))).toBe('5i')
    expect(toDisplayString(toComplex(-2, 0))).toBe('-2')
    expect(toDisplayString(toComplex(0, 0))).toBe('0')
  })
})