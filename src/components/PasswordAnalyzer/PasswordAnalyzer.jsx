import { useState } from 'react'
import SecurityMeter from '../SecurityMeter/SecurityMeter.jsx'
import Alert from '../Alert/Alert.jsx'
import { analyzePassword } from '../../services/passwordService.js'
import { MAX_PASSWORD_LENGTH } from '../../utils/validators.js'

export default function PasswordAnalyzer() {
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const analysis = analyzePassword(password)

  return (
    <div className="card">
      <h2>Analizador de contraseñas</h2>
      <p className="card-sub">
        Escribe una contraseña y se analizará al instante, localmente en tu
        navegador. Nunca se almacena ni se envía a ningún servidor.
      </p>

      <div className="form-group">
        <label className="field-label" htmlFor="password-input">
          Contraseña a analizar
        </label>
        <div className="password-input-wrap">
          <input
            id="password-input"
            type={visible ? 'text' : 'password'}
            value={password}
            maxLength={MAX_PASSWORD_LENGTH}
            placeholder="Escribe una contraseña de prueba..."
            autoComplete="off"
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            className="password-visibility"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {visible ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      {password ? (
        <>
          <SecurityMeter
            strength={analysis.strength}
            checks={analysis.checks}
            warnings={analysis.warnings}
          />

          {analysis.recommendations.length > 0 && (
            <Alert variant="warning" title="Recomendaciones" style={{ marginTop: 16 }}>
              <ul className="recommendations-list">
                {analysis.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Alert>
          )}
        </>
      ) : (
        <p className="empty-hint">
          El análisis aparecerá aquí en cuanto escribas una contraseña.
        </p>
      )}
    </div>
  )
}