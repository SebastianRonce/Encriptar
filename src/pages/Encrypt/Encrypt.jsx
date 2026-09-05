import MessageEncryptor from '../../components/MessageEncryptor/MessageEncryptor.jsx'

export default function Encrypt() {
  return (
    <div>
      <header className="page-header">
        <h1>Cifrar mensaje</h1>
        <p>
          El cifrado transforma información legible en información que no puede
          interpretarse fácilmente sin conocer la clave correspondiente.
        </p>
      </header>
      <MessageEncryptor />
    </div>
  )
}