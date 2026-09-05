import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Navbar.css'

const NAV_ITEMS = [
  { to: '/encrypt', label: 'Cifrar' },
  { to: '/decrypt', label: 'Descifrar' },
  { to: '/password', label: 'Contraseñas' },
  { to: '/complex', label: 'Números complejos' },
  { to: '/about', label: 'Acerca' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <span className="navbar-logo" aria-hidden="true">
            🔐
          </span>
          <span className="navbar-name">CryptoSafe</span>
        </Link>

        <button
          className="navbar-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? '✕' : '☰'}
        </button>

        <nav className={`navbar-links${open ? ' is-open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `navbar-link${isActive ? ' is-active' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}