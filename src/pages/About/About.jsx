import './About.css'

const STACK = [
  ['Frontend', 'React 19 + Vite'],
  ['Rutas', 'React Router'],
  ['Lenguaje', 'JavaScript (ESM)'],
  ['Estilos', 'CSS moderno con variables'],
  ['Pruebas', 'Vitest'],
  ['Criptografía real', 'Web Crypto API (AES-GCM, PBKDF2)']
]

export default function About() {
  return (
    <div>
      <header className="page-header">
        <h1>Acerca del proyecto</h1>
        <p>Qué es CryptoSafe, cómo funciona y qué limitaciones tiene.</p>
      </header>

      <div className="card">
        <h2>Qué es CryptoSafe</h2>
        <p>
          CryptoSafe es una aplicación web de <strong>ciberseguridad
          educativa</strong>. Su objetivo es enseñar, de forma práctica e
          intuitiva, tres conceptos fundamentales: cómo se cifra y descifra
          información, cómo funcionan los números complejos dentro de una
          transformación matemática, y qué hace que una contraseña sea segura.
        </p>
      </div>

      <div className="card">
        <h2>Cómo funciona el cifrado educativo</h2>
        <p>
          Cada carácter del mensaje se convierte en un número complejo{' '}
          <code className="mono">z = código + 0i</code>. Con cada carácter de
          la clave se construye otro complejo <code className="mono">w = código + k·i</code>{' '}
          y se aplica la <strong>multiplicación compleja</strong>. Para
          descifrar se aplica la <strong>división compleja</strong>, que
          recupera exactamente el código original. Un checksum permite
          detectar claves incorrectas o datos alterados.
        </p>
        <p>
          <strong>Importante:</strong> este algoritmo es una demostración
          matemática con fines educativos y <strong>no es un sustituto</strong>{' '}
          de algoritmos criptográficos seguros como AES, ChaCha20 o los
          utilizados por bibliotecas reconocidas. Para experimentar con
          criptografía real, CryptoSafe ofrece un modo basado en{' '}
          <strong>AES-GCM</strong> con la Web Crypto API del navegador.
        </p>
      </div>

      <div className="card">
        <h2>Seguridad y privacidad</h2>
        <ul className="about-list">
          <li>Todos los cálculos se realizan localmente en tu navegador.</li>
          <li>Las contraseñas nunca se almacenan ni se envían a ningún servidor.</li>
          <li>Los mensajes y contraseñas no se registran en consola ni en localStorage.</li>
          <li>El generador de contraseñas usa <code className="mono">crypto.getRandomValues()</code>.</li>
          <li>El modo seguro usa <code className="mono">crypto.subtle</code> con PBKDF2 y AES-GCM 256.</li>
          <li>Las entradas se validan y React escapa el contenido para evitar XSS.</li>
        </ul>
      </div>

      <div className="card">
        <h2>Tecnologías</h2>
        <div className="stack-table">
          {STACK.map(([label, value]) => (
            <div key={label} className="stack-row">
              <span className="stack-label">{label}</span>
              <span className="stack-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Limitaciones</h2>
        <ul className="about-list">
          <li>El cifrado educativo de números complejos no protege información real.</li>
          <li>El análisis de contraseñas es un estimador con heurísticas; el mejor indicador es la entropía real calculada por herramientas especializadas.</li>
          <li>La lista de contraseñas comunes es una muestra representativa, no exhaustiva.</li>
          <li>PBKDF2 con 150.000 iteraciones es un compromiso razonable para la demo; en producción se recomienda Argon2id.</li>
        </ul>
      </div>
    </div>
  )
}