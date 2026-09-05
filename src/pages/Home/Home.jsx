import { Link } from 'react-router-dom'
import './Home.css'

const FEATURES = [
  {
    to: '/encrypt',
    icon: '🔐',
    title: 'Cifrar mensaje',
    description:
      'Transforma un mensaje en texto cifrado usando multiplicación de números complejos o AES-GCM.'
  },
  {
    to: '/decrypt',
    icon: '🔓',
    title: 'Descifrar mensaje',
    description:
      'Recupera el mensaje original utilizando exactamente el proceso inverso del cifrado.'
  },
  {
    to: '/password',
    icon: '🔑',
    title: 'Analizar contraseña',
    description:
      'Evalúa la fortaleza de una contraseña y recibe recomendaciones para mejorarla.'
  },
  {
    to: '/complex',
    icon: '🧮',
    title: 'Números complejos',
    description:
      'Explora la suma, resta, multiplicación, división, módulo y conjugado en el plano complejo.'
  },
  {
    to: '/about',
    icon: 'ℹ️',
    title: 'Acerca del proyecto',
    description:
      'Conoce el funcionamiento, las tecnologías y las consideraciones de seguridad de CryptoSafe.'
  }
]

export default function Home() {
  return (
    <div>
      <section className="hero">
        <span className="eyebrow">Ciberseguridad educativa</span>
        <h1>CryptoSafe</h1>
        <p className="hero-sub">
          Herramienta educativa para explorar el cifrado de mensajes, números
          complejos y seguridad de contraseñas.
        </p>
        <div className="hero-actions">
          <Link to="/encrypt" className="btn btn-primary">
            🔒 Cifrar un mensaje
          </Link>
          <Link to="/password" className="btn btn-secondary">
            🔑 Probar el analizador
          </Link>
        </div>
      </section>

      <section className="feature-grid">
        {FEATURES.map((feature) => (
          <Link key={feature.to} to={feature.to} className="feature-card">
            <span className="feature-icon" aria-hidden="true">
              {feature.icon}
            </span>
            <span className="feature-title">{feature.title}</span>
            <span className="feature-desc">{feature.description}</span>
            <span className="feature-go">Explorar →</span>
          </Link>
        ))}
      </section>

      <section className="home-note">
        <h2>Sobre el cifrado educativo</h2>
        <p>
          El cifrado basado en números complejos es una <strong>demostración
          matemática</strong> que sirve para aprender los conceptos de la
          criptografía: transformar la información, usar una clave y aplicar
          procesos reversibles. <strong>No debe usarse para proteger datos
          reales</strong>: para eso están algoritmos auditados como AES,
          ChaCha20 o los que usan las bibliotecas criptográficas reconocidas.
        </p>
      </section>
    </div>
  )
}