export function getHealth(req, res) {
  res.json({
    status: 'ok',
    service: 'cryptosafe',
    note: 'Todo el cifrado y análisis se realiza en el cliente. Este servidor solo informa el estado del servicio.'
  })
}