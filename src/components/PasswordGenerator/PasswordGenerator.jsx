import { useState } from 'react'
import Alert from '../Alert/Alert.jsx'
import { generatePassword } from '../../services/passwordService.js'
import { copyToClipboard } from '../../utils/helpers.js'

const LABELS = {
  uppercase: 'Mayúsculas (A-Z)',
  lowercase: 'Minúsculas (a-z)',
  digits: 'Números (0-9)',
  special: 'Especiales (!@#$…)'
}

const DEFAULT_OPTIONS = {
  length: 16,
  uppercase: true,
  lowercase: true,
  digits: true,
  special: true,
  excludeAmbiguous: true
}

export default function PasswordGenerator() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const update = (key, value) => {
    setOptions((current) => ({ ...current, [key]: value }))
    setError('')
  }

  const handleGenerate = () => {
    setError('')
    try {
      setResult(generatePassword(options))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await copyToClipboard(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setError('No se pudo copiar la contraseña.')
    }
  }

  const categoryOptions = ['uppercase', 'lowercase', 'digits', 'special']

  return (
    <div className="card">
      <h2>Generador de contraseñas</h2>
      <p className="card-sub">
        Genera contraseñas aleatorias usando{' '}
        <code className="mono">crypto.getRandomValues()</code>, una fuente
        criptográficamente segura (no es un simple aleatorio).
      </p>

      <div className="form-group">
        <label className="field-label" htmlFor="generator-length">
          Longitud: <strong>{options.length}</strong>
        </label>
        <input
          id="generator-length"
          type="range"
          min="6"
          max="64"
          value={options.length}
          onChange={(event) => update('length', Number(event.target.value))}
        />
      </div>

      <div className="checkbox-grid">
        {categoryOptions.map((key) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={options[key]}
              onChange={(event) => update(key, event.target.checked)}
            />
            {LABELS[key]}
          </label>
        ))}
      </div>

      <label className="checkbox-row" style={{ marginTop: 10 }}>
        <input
          type="checkbox"
          checked={options.excludeAmbiguous}
          onChange={(event) => update('excludeAmbiguous', event.target.checked)}
        />
        Evitar caracteres ambiguos (l, 1, I, O, 0)
      </label>

      {error && (
        <Alert variant="error" style={{ marginTop: 14 }}>
          {error}
        </Alert>
      )}

      <div className="btn-row" style={{ marginTop: 18 }}>
        <button type="button" className="btn btn-primary btn-block" onClick={handleGenerate}>
          🎲 Generar contraseña
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 18 }}>
          <label className="field-label">Resultado</label>
          <div className="generated-box">
            <span className="kbd-output">{result}</span>
            <button type="button" className="btn btn-secondary" onClick={handleCopy}>
              {copied ? '✅ Copiado' : '📋 Copiar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}