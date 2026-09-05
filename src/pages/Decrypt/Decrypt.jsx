import MessageDecryptor from '../../components/MessageDecryptor/MessageDecryptor.jsx'

export default function Decrypt() {
  return (
    <div>
      <header className="page-header">
        <h1>Descifrar mensaje</h1>
        <p>
          El descifrado aplica exactamente el proceso inverso del cifrado para
          recuperar el mensaje original:
        </p>
        <p className="flow-diagram mono">
          Mensaje original → Cifrado → Mensaje cifrado → Descifrado → Original
        </p>
      </header>
      <MessageDecryptor />
    </div>
  )
}