import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import healthRoutes from './routes/health.routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json({ limit: '10kb' }))

app.use('/api/health', healthRoutes)

const clientDist = path.resolve(__dirname, '..', 'dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.json({
      message:
        'CryptoSafe API. Ejecuta "npm run build" para servir el frontend, o usa "npm run dev" para desarrollo.'
    })
  })
}

app.use((err, req, res, next) => {
  console.error('Error del servidor:', err.message)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log(`Server de CryptoSafe escuchando en http://localhost:${PORT}`)
})