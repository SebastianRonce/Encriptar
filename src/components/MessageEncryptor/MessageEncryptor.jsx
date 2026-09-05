import { useState } from 'react'
import Tabs from '../Tabs/Tabs.jsx'
import Alert from '../Alert/Alert.jsx'
import StepGuide from '../StepGuide/StepGuide.jsx'
import { validateEncryptionInput } from '../../utils/validators.js'
import { encryptEducational, encryptSecure } from '../../services/encryptionService.js'
import { copyToClipboard } from '../../utils/helpers.js'

const MODES = [
  { id: 'complex', label: 'Educativo · números complejos' },
  { id: 'secure', label: 'Seguro · AES-GCM' }
]

function modeSteps(mode) {
  if (mode === 'secure') {
    return [
      'El mensaje se convierte a bytes (UTF-8).',
      'La clave se procesa con PBKDF2 para derivar una clave AES-256.',
      'Se genera un IV aleatorio y se cifra con AES-GCM, que además detecta manipulación.',
      'El resultado se empaqueta con un encabezado que identifica el formato.'
    ]
  }
  return [
    'Cada carácter del mensaje se convierte a su código Unicode:  A -> 65, B -> 66...',
    'Ese valor pasa a ser la parte real de un número complejo:  z = código + 0i.',
    'Con cada carácter de la clave se construye otro complejo:  w = código + k·i.',
    'Se multiplica:  z · w = (a·c - b·d) + (a·d + b·c)i.',
    'El resultado (parte real e imaginaria) se guarda como par de números.'
  ]
}

export default function MessageEncryptor() {
  const [mode, setMode] = useState('complex')
  const [message, setMessage] = useState('')
  const [key, setKey] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [working, setWorking] = useState(false)

  const handleEncrypt = async () => {
    setError('')
    setResult('')
    const validation = validateEncryptionInput(message, key)
    if (!validation.valid) {
      setError(validation.error)
      return
    }
    setWorking(true)
    try {
      const output =
        mode === 'secure' ? await encryptSecure(message, key) : encryptEducational(message, key)
      setResult(output)
    } catch (err) {
      setError(err.message || 'No se pudo cifrar el mensaje.')
    } finally {
      setWorking(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await copyToClipboard(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setError('No se pudo copiar el resultado. Copia el texto manualmente.')
    }
  }

  const handleClean = () => {
    setMessage('')
    setKey('')
    setResult('')
    setError('')
    setCopied(false)
  }

  return (
    <div>
      <Tabs
        items={MODES}
        active={mode}
        onChange={setMode}
        ariaLabel="Modo de cifrado"
      />

      <Alert variant="info">
        {mode === 'secure'
          ? 'Modo AES-GCM: cifrado real con Web Crypto API. Los resultados no pueden descifrarse sin la clave exacta, y se detecta cualquier alteración.'
          : 'Este modo es educativo: transforma tu mensaje usando multiplicación de números complejos. NO es seguro para proteger información real.'}
      </Alert>

      <form
        className="card"
        style={{ marginTop: 18 }}
        onSubmit={(event) => {
          event.preventDefault()
          handleEncrypt()
        }}
      >
        <h2>Cifrar mensaje</h2>
        <p className="card-sub">
          Escribe un mensaje y una clave. El resultado será el mensaje cifrado.
        </p>

        <div className="form-group">
          <label className="field-label" htmlFor="encrypt-message">
            Mensaje a cifrar
          </label>
          <textarea
            id="encrypt-message"
            className="mono"
            value={message}
            maxLength={5000}
            placeholder="Escribe aquí tu mensaje de prueba..."
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="field-label" htmlFor="encrypt-key">
            Clave (secreta)
          </label>
          <input
            id="encrypt-key"
            type="password"
            value={key}
            maxLength={128}
            placeholder="Mínimo 4 caracteres"
            autoComplete="off"
            onChange={(event) => setKey(event.target.value)}
          />
        </div>

        {error && (
          <Alert variant="error" title="No se pudo cifrar" style={{ marginBottom: 14 }}>
            {error}
          </Alert>
        )}

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={working}>
            {working ? 'Cifrando…' : '🔒 Cifrar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClean}>
            Limpiar
          </button>
        </div>
      </form>

      {result && (
        <div className="card" style={{ marginTop: 20 }}>
          <h2>Mensaje cifrado</h2>
          <pre className="output-box">{result}</pre>
          <div className="btn-row">
            <button type="button" className="btn btn-secondary" onClick={handleCopy}>
              {copied ? '✅ Copiado' : '📋 Copiar resultado'}
            </button>
          </div>
        </div>
      )}

      <StepGuide title="¿Qué está pasando?" steps={modeSteps(mode)} />
    </div>
  )
}