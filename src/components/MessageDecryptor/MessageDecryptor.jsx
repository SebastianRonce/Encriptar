import { useState } from 'react'
import Tabs from '../Tabs/Tabs.jsx'
import Alert from '../Alert/Alert.jsx'
import StepGuide from '../StepGuide/StepGuide.jsx'
import { validateDecryptionInput } from '../../utils/validators.js'
import {
  decryptEducational,
  decryptSecure,
  isSecureCipher,
  ciphertextFormatIsValid,
  DecryptError
} from '../../services/encryptionService.js'
import { copyToClipboard } from '../../utils/helpers.js'

const MODES = [
  { id: 'complex', label: 'Educativo · números complejos' },
  { id: 'secure', label: 'Seguro · AES-GCM' }
]

export default function MessageDecryptor() {
  const [mode, setMode] = useState('complex')
  const [cipherText, setCipherText] = useState('')
  const [key, setKey] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [working, setWorking] = useState(false)

  const handleDecrypt = async () => {
    setError('')
    setResult('')
    const validation = validateDecryptionInput(cipherText, key)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    const trimmed = cipherText.trim()
    if (!ciphertextFormatIsValid(trimmed)) {
      setError(
        'El mensaje cifrado no tiene un formato reconocido. Copia exactamente el resultado de la sección "Cifrar".'
      )
      return
    }

    const secure = isSecureCipher(trimmed)
    if (secure) setMode('secure')

    setWorking(true)
    try {
      const text = secure
        ? await decryptSecure(trimmed, key)
        : decryptEducational(trimmed, key)
      setResult(text)
      setMode(secure ? 'secure' : 'complex')
    } catch (err) {
      const message =
        err instanceof DecryptError || err.message
          ? err.message
          : 'La clave es incorrecta o los datos están corruptos.'
      setError(
        'No se pudo descifrar. ' + message
      )
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
      setError('No se pudo copiar el resultado.')
    }
  }

  const handleClean = () => {
    setCipherText('')
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
        ariaLabel="Modo de descifrado"
      />

      <Alert variant="info" title="Formato detectado automáticamente">
        El sistema reconoce si el texto fue cifrado con el modo educativo o
        con AES-GCM y aplica el proceso inverso correspondiente.
      </Alert>

      <form
        className="card"
        style={{ marginTop: 18 }}
        onSubmit={(event) => {
          event.preventDefault()
          handleDecrypt()
        }}
      >
        <h2>Descifrar mensaje</h2>
        <p className="card-sub">
          Pega el mensaje cifrado y escribe la misma clave que se usó para
          cifrarlo.
        </p>

        <div className="form-group">
          <label className="field-label" htmlFor="decrypt-cipher">
            Mensaje cifrado
          </label>
          <textarea
            id="decrypt-cipher"
            className="mono"
            value={cipherText}
            placeholder="Pega aquí el texto cifrado..."
            onChange={(event) => setCipherText(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="field-label" htmlFor="decrypt-key">
            Clave
          </label>
          <input
            id="decrypt-key"
            type="password"
            value={key}
            maxLength={128}
            placeholder="La clave usada al cifrar"
            autoComplete="off"
            onChange={(event) => setKey(event.target.value)}
          />
        </div>

        {error && (
          <Alert variant="error" style={{ marginBottom: 14 }}>
            {error}
          </Alert>
        )}

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={working}>
            {working ? 'Descifrando…' : '🔓 Descifrar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClean}>
            Limpiar
          </button>
        </div>
      </form>

      {result && (
        <div className="card" style={{ marginTop: 20 }}>
          <h2>Mensaje original</h2>
          <Alert variant="success" style={{ marginBottom: 12 }}>
            Descifrado correcto. Este es el mensaje que se cifró originalmente.
          </Alert>
          <pre className="output-box">{result}</pre>
          <div className="btn-row">
            <button type="button" className="btn btn-secondary" onClick={handleCopy}>
              {copied ? '✅ Copiado' : '📋 Copiar mensaje'}
            </button>
          </div>
        </div>
      )}

      <StepGuide
        title="¿Qué está pasando?"
        steps={
          mode === 'secure'
            ? [
                'Se extraen sal e IV desde el mensaje cifrado.',
                'La clave se reconstruye con PBKDF2 usando la misma sal.',
                'AES-GCM verifica la autenticidad: si la clave es incorrecta o los datos fueron alterados, el descifrado falla.',
                'Si todo es válido, se recupera el texto original.'
              ]
            : [
                'El mensaje cifrado vuelve a dividirse en pares (parte real, parte imaginaria).',
                'Con cada carácter de la clave se reconstruye el complejo w = código + k·i.',
                'Se divide:  z / w = (a·c + b·d)/(c²+d²) + ...i.',
                'La parte real resultante es exactamente el código Unicode del carácter original.',
                'El checksum verifica que la clave sea correcta y los datos no estén corruptos.'
              ]
        }
      />
    </div>
  )
}