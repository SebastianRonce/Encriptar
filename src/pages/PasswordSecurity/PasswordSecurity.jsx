import { useState } from 'react'
import Tabs from '../../components/Tabs/Tabs.jsx'
import PasswordAnalyzer from '../../components/PasswordAnalyzer/PasswordAnalyzer.jsx'
import PasswordGenerator from '../../components/PasswordGenerator/PasswordGenerator.jsx'
import './PasswordSecurity.css'

const MODES = [
  { id: 'analyzer', label: 'Analizador' },
  { id: 'generator', label: 'Generador' }
]

export default function PasswordSecurity() {
  const [mode, setMode] = useState('analyzer')

  return (
    <div>
      <header className="page-header">
        <h1>Seguridad de contraseñas</h1>
        <p>
          Una contraseña segura debe ser suficientemente larga, difícil de
          adivinar y evitar patrones o información personal. Todo se analiza
          localmente en tu navegador.
        </p>
      </header>

      <Tabs items={MODES} active={mode} onChange={setMode} ariaLabel="Herramientas de contraseñas" />

      <div className={`password-tool${mode === 'generator' ? '' : ' password-tool-max'}`}>
        {mode === 'analyzer' ? <PasswordAnalyzer /> : <PasswordGenerator />}
      </div>
    </div>
  )
}