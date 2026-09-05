import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
      <p className="eyebrow">Error 404</p>
      <h1 style={{ fontSize: '2.4rem', margin: '0 0 10px' }}>Página no encontrada</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        La página que buscas no existe o fue movida.
      </p>
      <p>
        <Link to="/" className="btn btn-primary">
          ← Volver al inicio
        </Link>
      </p>
    </div>
  )
}