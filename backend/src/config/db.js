const { Pool } = require('pg')

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || 'ugl2026',
        user: process.env.DB_USER || 'mactar',
        password: process.env.DB_PASSWORD || '',
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
)

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err.message)
})

async function query(text, params) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  if (process.env.NODE_ENV === 'development' && duration > 500) {
    console.warn(`Slow query (${duration}ms):`, text)
  }
  return res
}

async function getClient() {
  return pool.connect()
}

module.exports = { query, getClient, pool }
