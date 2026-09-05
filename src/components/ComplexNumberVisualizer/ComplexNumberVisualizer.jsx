import { useState } from 'react'
import Alert from '../Alert/Alert.jsx'
import {
  toComplex,
  modulus,
  conjugate,
  argument,
  add,
  subtract,
  multiply,
  divide,
  toDisplayString,
  formatNumber
} from '../../services/complexNumberService.js'
import { validateComplexInput } from '../../utils/validators.js'

const VIEW_SIZE = 320
const CENTER = VIEW_SIZE / 2
const GRID_STEP = 40

function scalePoint(re, im) {
  return {
    x: CENTER + re * GRID_STEP,
    y: CENTER - im * GRID_STEP
  }
}

function ComplexPlot({ z1, z2 }) {
  const points = []

  points.push({ label: 'z1', z: z1, color: '#22d3ee' })
  if (z2) points.push({ label: 'z2', z: z2, color: '#34d399' })

  const range = Math.max(
    Math.abs(z1.re),
    Math.abs(z1.im) || 1,
    z2 ? Math.abs(z2.re) : 1,
    z2 ? Math.abs(z2.im) : 1,
    1
  )
  const maxCoord = Math.max(2, Math.ceil(range + 1))
  const ticks = []
  for (let i = -maxCoord; i <= maxCoord; i += 1) {
    ticks.push(i)
  }

  const active = z2 ? points : [points[0]]

  return (
    <svg
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      className="complex-plot"
      role="img"
      aria-label="Plano complejo con el punto z"
      width="100%"
      height={VIEW_SIZE}
    >
      <rect width={VIEW_SIZE} height={VIEW_SIZE} fill="#0b1120" rx="10" />

      {ticks.map((i) => {
        const step = i * GRID_STEP
        if (i !== 0) {
          return (
            <g key={i}>
              <line
                x1={step}
                y1={8}
                x2={step}
                y2={VIEW_SIZE - 8}
                stroke={CENTER === step ? 'transparent' : 'rgba(59,78,121,0.35)'}
                strokeWidth="1"
              />
              <line
                x1={8}
                y1={step}
                x2={VIEW_SIZE - 8}
                y2={step}
                stroke={CENTER === step ? 'transparent' : 'rgba(59,78,121,0.35)'}
                strokeWidth="1"
              />
            </g>
          )
        }
        return null
      })}

      <line
        x1={0}
        y1={CENTER}
        x2={VIEW_SIZE}
        y2={CENTER}
        stroke="#5b6a8c"
        strokeWidth="1.5"
      />
      <line
        x1={CENTER}
        y1={0}
        x2={CENTER}
        y2={VIEW_SIZE}
        stroke="#5b6a8c"
        strokeWidth="1.5"
      />
      <text x={VIEW_SIZE - 14} y={CENTER - 10} fill="#94a3bd" fontSize="13" fontFamily="monospace">
        Re
      </text>
      <text x={CENTER + 10} y={16} fill="#94a3bd" fontSize="13" fontFamily="monospace">
        Im
      </text>

      {active.map(({ z, color }) => {
        const p = scalePoint(z.re, z.im)
        const conj = conjugate(z)
        const pc = scalePoint(conj.re, conj.im)
        return (
          <g key={color}>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={modulus(z) * GRID_STEP}
              fill="none"
              stroke={color}
              strokeOpacity="0.35"
              strokeDasharray="4 4"
            />
            <line
              x1={CENTER}
              y1={CENTER}
              x2={p.x}
              y2={p.y}
              stroke={color}
              strokeWidth="2"
            />
            <circle cx={p.x} cy={p.y} r="6" fill={color} />
            <text x={p.x + 10} y={p.y - 10} fill={color} fontSize="13" fontFamily="monospace">
              {points.length === 1 ? 'z' : z === z2 ? 'z₂' : 'z₁'}
            </text>
            <circle cx={pc.x} cy={pc.y} r="4" fill={color} opacity="0.5" />
            <text
              x={pc.x + 10}
              y={pc.y - 10}
              fill={color}
              fontSize="12"
              fontFamily="monospace"
              opacity="0.7"
            >
              {points.length === 1 ? 'z̄' : z === z2 ? 'z̄₂' : 'z̄₁'}
            </text>
          </g>
        )
      })}

      <circle cx={CENTER} cy={CENTER} r="3" fill="#e7eefb" />
    </svg>
  )
}

function PropertyTable({ z }) {
  const mod = modulus(z)
  const conj = conjugate(z)
  const arg = argument(z)
  const degrees = (arg * 180) / Math.PI

  return (
    <div className="property-list">
      <div>
        <span className="property-label">z = a + bi</span>
        <span className="property-value mono">{toDisplayString(z)}</span>
      </div>
      <div>
        <span className="property-label">Módulo |z| = √(a² + b²)</span>
        <span className="property-value mono">{formatNumber(mod, 4)}</span>
      </div>
      <div>
        <span className="property-label">Conjugado z̄ = a - bi</span>
        <span className="property-value mono">{toDisplayString(conj)}</span>
      </div>
      <div>
        <span className="property-label">Argumento θ = arctan(b/a)</span>
        <span className="property-value mono">
          {formatNumber(arg, 4)} rad · {formatNumber(degrees, 2)}°
        </span>
      </div>
    </div>
  )
}

function OperationCard({ title, result }) {
  return (
    <div className="operation-card">
      <span className="operation-title">{title}</span>
      <span className="operation-result mono">{toDisplayString(result)}</span>
    </div>
  )
}

export default function ComplexNumberVisualizer() {
  const [a, setA] = useState('3')
  const [b, setB] = useState('4')
  const [c, setC] = useState('1')
  const [d, setD] = useState('-1')
  const [error, setError] = useState('')

  const z1 = toComplex(a, b)
  const z2 = toComplex(c, d)

  const validMain = validateComplexInput(a, b).valid
  const validSecond = validateComplexInput(c, d).valid

  const operations =
    validMain && validSecond
      ? { add: add(z1, z2), subtract: subtract(z1, z2), multiply: multiply(z1, z2) }
      : null

  let division = null
  if (validMain && validSecond) {
    try {
      division = divide(z1, z2)
    } catch {
      division = null
    }
  }

  return (
    <div>
      <div className="grid-2">
        <div className="card">
          <h2>Tu número complejo</h2>
          <p className="card-sub">
            Un número complejo tiene una parte real y una parte imaginaria:
            <code className="mono"> z = a + bi </code>, donde <code className="mono">i² = -1</code>.
          </p>

          <div className="form-group">
            <label className="field-label" htmlFor="complex-real">
              Parte real (a)
            </label>
            <input
              id="complex-real"
              type="number"
              step="any"
              value={a}
              onChange={(event) => setA(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="field-label" htmlFor="complex-imag">
              Parte imaginaria (b)
            </label>
            <input
              id="complex-imag"
              type="number"
              step="any"
              value={b}
              onChange={(event) => setB(event.target.value)}
            />
          </div>

          {!validMain && <Alert variant="error">La parte real y la imaginaria deben ser números.</Alert>}

          {validMain && <PropertyTable z={z1} />}
        </div>

        <div className="card">
          <h2>Representación gráfica</h2>
          <p className="card-sub">
            Cada punto del plano es un número complejo: el eje horizontal es la
            parte real y el vertical la imaginaria.
          </p>
          <ComplexPlot z1={z1} z2={operations ? z2 : null} />
        </div>
      </div>

      <div className="card">
        <h2>Operaciones entre dos números complejos</h2>
        <p className="card-sub">
          Escribe un segundo número complejo z₂ = c + di para ver el resultado de
          cada operación.
        </p>

        <div className="complex-inputs-row">
          <div className="form-group">
            <label className="field-label" htmlFor="complex-real-2">
              Parte real (c)
            </label>
            <input
              id="complex-real-2"
              type="number"
              step="any"
              value={c}
              onChange={(event) => setC(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="field-label" htmlFor="complex-imag-2">
              Parte imaginaria (d)
            </label>
            <input
              id="complex-imag-2"
              type="number"
              step="any"
              value={d}
              onChange={(event) => setD(event.target.value)}
            />
          </div>
        </div>

        {!validSecond && <Alert variant="error">El segundo número también debe tener valores numéricos.</Alert>}

        {operations && (
          <div className="operation-grid">
            <OperationCard title={`z₁ + z₂`} result={operations.add} />
            <OperationCard title={`z₁ - z₂`} result={operations.subtract} />
            <OperationCard title={`z₁ × z₂`} result={operations.multiply} />
            {division ? (
              <OperationCard title={`z₁ ÷ z₂`} result={division} />
            ) : (
              <div className="operation-card">
                <span className="operation-title">z₁ ÷ z₂</span>
                <span className="operation-result">No definida (división entre cero)</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}