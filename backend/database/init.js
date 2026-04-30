require('dotenv').config()
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

async function init() {
  const client = await pool.connect()
  try {
    console.log('📦 Подключение к базе данных...')

    // Run schema
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
    await client.query(schema)
    console.log('✅ Схема создана')

    // Create admin
    const username = process.env.ADMIN_USERNAME || 'admin'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const hash = await bcrypt.hash(password, 12)

    await client.query(`
      INSERT INTO admins (username, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (username) DO UPDATE SET password_hash = $2
    `, [username, hash])
    console.log(`✅ Администратор создан: ${username}`)

    console.log('\n🎮 База данных готова!')
    console.log(`   Логин: ${username}`)
    console.log(`   Пароль: ${password}`)
  } catch (err) {
    console.error('❌ Ошибка инициализации:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

init()
