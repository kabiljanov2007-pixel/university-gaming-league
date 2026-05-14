require('dotenv').config()
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        database: process.env.DB_NAME || 'ugl2026',
        user: process.env.DB_USER || 'mactar',
        password: process.env.DB_PASSWORD || '',
      }
)

async function seedNews() {
  const client = await pool.connect()
  try {
    const sqlPath = path.join(__dirname, 'update_news_2026_05_22.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    await client.query(sql)
    console.log('✅ Новости успешно добавлены (3 записи)')
  } catch (err) {
    console.error('❌ Ошибка заполнения новостей:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seedNews()
