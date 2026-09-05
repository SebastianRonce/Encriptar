import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>
          <strong>CryptoSafe</strong> es una herramienta educativa. El cifrado
          con números complejos se usa para aprender conceptos matemáticos y{' '}
          <strong>no debe utilizarse para proteger información real</strong>.
          Para datos sensibles usa algoritmos reconocidos como AES o ChaCha20.
        </p>
        <p>
          Todo el análisis se realiza localmente en tu navegador. Nunca
          almacenamos ni transmitimos tus mensajes o contraseñas.
        </p>
      </div>
    </footer>
  )
}