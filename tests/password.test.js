import { describe, it, expect } from 'vitest'
import {
  analyzePassword,
  generatePassword,
  CATEGORIES
} from '../src/services/passwordService.js'

const categoryOf = (password) => analyzePassword(password).category
const RECOMMENDED_CHARSET = /^[A-Za-z0-9!@#$%^&*()\-_=+\[\]{};:,.<>?/~]+$/

describe('Análisis de contraseñas', () => {
  it('clasifica contraseñas muy débiles', () => {
    expect(categoryOf('123456')).toBe('MUY_DEBIL')
    expect(categoryOf('666666')).toBe('MUY_DEBIL')
    expect(categoryOf('abc')).toBe('MUY_DEBIL')
  })

  it('clasifica contraseñas comunes como muy débiles', () => {
    expect(categoryOf('password')).toBe('MUY_DEBIL')
    expect(categoryOf('qwerty')).toBe('MUY_DEBIL')
    expect(categoryOf('letmein')).toBe('MUY_DEBIL')
  })

  it('clasifica claramente diferenciando entre débil y fuerte', () => {
    const weak = analyzePassword('Hola123').strength
    const strong = analyzePassword('HolaMundo2026!').strength
    expect(strong).toBeGreaterThan(weak)
  })

  it('detecta secuencias de teclado', () => {
    const analysis = analyzePassword('qwerty2024!')
    expect(analysis.warnings.some((w) => /secuencias|patrones/i.test(w))).toBe(true)
  })

  it('detecta caracteres repetidos', () => {
    const analysis = analyzePassword('aaaabbbb')
    expect(analysis.recommendations.some((r) => /repetidos/i.test(r))).toBe(true)
  })

  it('una contraseña larga y aleatoria es excelente', () => {
    const analysis = analyzePassword('X7#mQ2!vP9@kL4$zB3rT1&yU')
    expect(CATEGORIES.EXCELENTE.min <= analysis.strength).toBe(true)
    expect(analysis.category).toBe('EXCELENTE')
  })

  it('una contraseña vacía da puntuación cero y categoría muy débil', () => {
    const analysis = analyzePassword('')
    expect(analysis.strength).toBe(0)
    expect(analysis.category).toBe('MUY_DEBIL')
  })

  it('las recomendaciones para contraseñas fuertes incluyen no reutilizar', () => {
    const analysis = analyzePassword('Tr0biform$e?p2026!Jd9')
    expect(analysis.category).toBe('EXCELENTE')
    expect(analysis.recommendations.some((r) => /reutilices/i.test(r))).toBe(true)
  })
})

describe('Generador de contraseñas', () => {
  it('genera contraseñas con la longitud solicitada', () => {
    const pwd = generatePassword({ length: 20 })
    expect(pwd.length).toBe(20)
  })

  it('genera contraseñas que respetan las categorías seleccionadas', () => {
    for (let i = 0; i < 20; i += 1) {
      const pwd = generatePassword({
        length: 16,
        uppercase: true,
        lowercase: true,
        digits: true,
        special: true
      })
      expect(pwd).toMatch(RECOMMENDED_CHARSET)
      expect(/[A-Z]/.test(pwd)).toBe(true)
      expect(/[a-z]/.test(pwd)).toBe(true)
      expect(/\d/.test(pwd)).toBe(true)
      expect(/[^A-Za-z0-9]/.test(pwd)).toBe(true)
    }
  })

  it('lanza error si no se selecciona ninguna categoría', () => {
    expect(() =>
      generatePassword({ length: 16, uppercase: false, lowercase: false, digits: false, special: false })
    ).toThrow(/categor/)
  })

  it('lanza error si la longitud es menor a las categorías', () => {
    expect(() =>
      generatePassword({ length: 2, uppercase: true, lowercase: true, digits: true, special: true })
    ).toThrow(/longitud/)
  })

  it('todas las contraseñas generadas ocupan rangos válidos de caracteres', () => {
    const pwd = generatePassword({ length: 32 })
    expect(pwd).toMatch(/^[\x20-\x7e]+$/)
  })
})