const router = require('express').Router()
const { body, param } = require('express-validator')
const { validate } = require('../middleware/validate')
const { requireAuth } = require('../middleware/auth')
const db = require('../config/db')

// ─── PUBLIC ──────────────────────────────────────────────────────────────────

// GET /api/news — published news
router.get('/', async (req, res) => {
  try {
    const { tag, limit = 20, offset = 0 } = req.query
    const params = []
    let sql = 'SELECT id, title, excerpt, tag, published, created_at FROM news WHERE published = TRUE'

    if (tag) {
      params.push(tag)
      sql += ` AND tag = $${params.length}`
    }

    params.push(parseInt(limit))
    params.push(parseInt(offset))
    sql += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`

    const result = await db.query(sql, params)

    const countRes = await db.query(
      'SELECT COUNT(*)::int AS total FROM news WHERE published = TRUE' + (tag ? ' AND tag = $1' : ''),
      tag ? [tag] : []
    )

    res.json({ items: result.rows, total: countRes.rows[0].total })
  } catch (err) {
    console.error('GET /news error:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// GET /api/news/:id — single article
router.get('/:id',
  [param('id').isInt().withMessage('Неверный ID')],
  validate,
  async (req, res) => {
    try {
      const result = await db.query(
        'SELECT * FROM news WHERE id = $1 AND published = TRUE',
        [req.params.id]
      )
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Новость не найдена' })
      }
      res.json(result.rows[0])
    } catch (err) {
      console.error('GET /news/:id error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

// ─── ADMIN ───────────────────────────────────────────────────────────────────

// GET /api/news/admin/all — all news including drafts (admin)
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, title, excerpt, tag, published, created_at, updated_at FROM news ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error('GET /news/admin/all error:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// POST /api/news — create article (admin)
router.post('/', requireAuth,
  [
    body('title').trim().isLength({ min: 3, max: 300 }).withMessage('Заголовок: 3–300 символов'),
    body('content').trim().notEmpty().withMessage('Введите содержание'),
    body('tag').trim().notEmpty().withMessage('Выберите тег'),
    body('excerpt').optional().trim(),
    body('published').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const { title, excerpt, content, tag, published = true } = req.body
      const result = await db.query(`
        INSERT INTO news (title, excerpt, content, tag, published)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [title, excerpt || content.substring(0, 200), content, tag, published])

      res.status(201).json(result.rows[0])
    } catch (err) {
      console.error('POST /news error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

// PUT /api/news/:id — update article (admin)
router.put('/:id', requireAuth,
  [
    param('id').isInt().withMessage('Неверный ID'),
    body('title').optional().trim().isLength({ min: 3, max: 300 }),
    body('content').optional().trim().notEmpty(),
    body('tag').optional().trim().notEmpty(),
    body('published').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const { title, excerpt, content, tag, published } = req.body

      const existing = await db.query('SELECT * FROM news WHERE id = $1', [req.params.id])
      if (existing.rows.length === 0) {
        return res.status(404).json({ message: 'Новость не найдена' })
      }

      const current = existing.rows[0]
      const result = await db.query(`
        UPDATE news SET
          title = $1, excerpt = $2, content = $3, tag = $4,
          published = $5, updated_at = NOW()
        WHERE id = $6
        RETURNING *
      `, [
        title ?? current.title,
        excerpt ?? current.excerpt,
        content ?? current.content,
        tag ?? current.tag,
        published ?? current.published,
        req.params.id,
      ])

      res.json(result.rows[0])
    } catch (err) {
      console.error('PUT /news/:id error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

// DELETE /api/news/:id — delete article (admin)
router.delete('/:id', requireAuth,
  [param('id').isInt().withMessage('Неверный ID')],
  validate,
  async (req, res) => {
    try {
      const result = await db.query('DELETE FROM news WHERE id = $1 RETURNING id', [req.params.id])
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Новость не найдена' })
      }
      res.json({ message: 'Новость удалена' })
    } catch (err) {
      console.error('DELETE /news/:id error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

module.exports = router
