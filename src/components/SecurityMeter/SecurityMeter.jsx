import { CATEGORIES } from '../../services/passwordService.js'
import './SecurityMeter.css'

const SEGMENTS = 10

export default function SecurityMeter({ strength, checks = [], warnings = [] }) {
  const categoryKey = Object.entries(CATEGORIES)
    .filter(([, config]) => strength >= config.min)
    .sort((a, b) => b[1].min - a[1].min)[0]?.[0]
  const category = CATEGORIES[categoryKey] || CATEGORIES.MUY_DEBIL

  const filled = Math.round((strength / 100) * SEGMENTS)

  return (
    <div className="meter">
      <div className="meter-top">
        <span className="meter-label">Seguridad de la contraseña</span>
        <span className="meter-value" style={{ color: category.color }}>
          {category.label}
        </span>
      </div>
      <div className="meter-bar" role="img" aria-label={`${strength} de 100 puntos`}>
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <span
            key={index}
            className={`meter-seg${index < filled ? ' is-filled' : ''}`}
            style={index < filled ? { background: category.color } : undefined}
          />
        ))}
      </div>
      <div className="meter-score">
        Puntaje: <strong>{strength}</strong>/100
      </div>

      {checks.length > 0 && (
        <ul className="meter-list">
          {checks.map((check) => (
            <li key={check.label} className={check.ok ? 'is-ok' : 'is-miss'}>
              <span aria-hidden="true">{check.ok ? '✓' : '✕'}</span>
              {check.label}
            </li>
          ))}
        </ul>
      )}

      {warnings.length > 0 && (
        <ul className="meter-warnings">
          {warnings.map((warning) => (
            <li key={warning}>
              <span aria-hidden="true">⚠</span>
              {warning}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}