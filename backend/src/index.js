require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth')
const teamsRoutes = require('./routes/teams')
const newsRoutes = require('./routes/news')
const resultsRoutes = require('./routes/results')
const statsRoutes = require('./routes/stats')
const disciplinesRoutes = require('./routes/disciplines')
const db = require('./config/db')

const app = express()
const PORT = process.env.PORT || 5001
const isProd = process.env.NODE_ENV === 'production'

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
}))

app.use(cors({
  origin: isProd ? true : ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}))

// ─── Rate limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Слишком много запросов. Попробуйте позже.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Слишком много попыток регистрации. Попробуйте через час.' },
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Слишком много попыток входа. Попробуйте позже.' },
})

app.use(globalLimiter)

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', loginLimiter, authRoutes)
app.use('/api/teams', teamsRoutes)
app.use('/api/teams/register', registerLimiter)
app.use('/api/news', newsRoutes)
app.use('/api/results', resultsRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/disciplines', disciplinesRoutes)

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1')
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() })
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' })
  }
})

// ─── Serve React frontend in production ───────────────────────────────────────
if (isProd) {
  const distPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  app.use((req, res) => {
    res.status(404).json({ message: `Маршрут ${req.method} ${req.path} не найден` })
  })
}

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Внутренняя ошибка сервера' })
})

// ─── Start ────────────────────────────────────────────────────────────────────
async function start() {
  try {
    await db.query('SELECT 1')
    console.log('✅ PostgreSQL подключён')
  } catch (err) {
    console.error('❌ Ошибка подключения к БД:', err.message)
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`\n🎮 University Gaming League`)
    console.log(`   http://localhost:${PORT}`)
    console.log(`   Режим: ${process.env.NODE_ENV || 'development'}\n`)
  })
}

start()
