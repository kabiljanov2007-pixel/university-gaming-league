const router = require('express').Router()
const db = require('../config/db')

// GET /api/disciplines
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM disciplines ORDER BY id ASC')
    res.json(result.rows)
  } catch (err) {
    console.error('GET /disciplines error:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// GET /api/disciplines/:slug
router.get('/:slug', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM disciplines WHERE slug = $1', [req.params.slug])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Дисциплина не найдена' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('GET /disciplines/:slug error:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
