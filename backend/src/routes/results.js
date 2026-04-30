const router = require('express').Router()
const { body, param } = require('express-validator')
const { validate } = require('../middleware/validate')
const { requireAuth } = require('../middleware/auth')
const db = require('../config/db')

// GET /api/results — all matches (public)
router.get('/', async (req, res) => {
  try {
    const { discipline, stage } = req.query
    const params = []
    let sql = `
      SELECT
        m.id, m.stage, m.group_name, m.score1, m.score2, m.played_at,
        d.name AS discipline_name, d.slug AS discipline_slug,
        t1.name AS team1_name, t1.id AS team1_id,
        t2.name AS team2_name, t2.id AS team2_id,
        w.name AS winner_name, w.id AS winner_id
      FROM matches m
      LEFT JOIN disciplines d ON m.discipline_id = d.id
      LEFT JOIN teams t1 ON m.team1_id = t1.id
      LEFT JOIN teams t2 ON m.team2_id = t2.id
      LEFT JOIN teams w ON m.winner_id = w.id
      WHERE 1=1
    `

    if (discipline) {
      params.push(discipline)
      sql += ` AND d.slug = $${params.length}`
    }
    if (stage) {
      params.push(stage)
      sql += ` AND m.stage = $${params.length}`
    }

    sql += ' ORDER BY m.id ASC'

    const result = await db.query(sql, params)
    res.json(result.rows)
  } catch (err) {
    console.error('GET /results error:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// POST /api/results — add match result (admin)
router.post('/', requireAuth,
  [
    body('discipline_slug').isIn(['pubg', 'freefire']).withMessage('Неверная дисциплина'),
    body('stage').isIn(['group', 'semifinal', 'final']).withMessage('Неверный этап'),
    body('team1_id').isInt().withMessage('Укажите team1_id'),
    body('team2_id').isInt().withMessage('Укажите team2_id'),
    body('score1').optional().isInt({ min: 0 }),
    body('score2').optional().isInt({ min: 0 }),
    body('winner_id').optional().isInt(),
    body('group_name').optional().trim(),
  ],
  validate,
  async (req, res) => {
    try {
      const { discipline_slug, stage, group_name, team1_id, team2_id, score1, score2, winner_id } = req.body

      const discRes = await db.query('SELECT id FROM disciplines WHERE slug = $1', [discipline_slug])
      if (discRes.rows.length === 0) {
        return res.status(400).json({ message: 'Дисциплина не найдена' })
      }

      const result = await db.query(`
        INSERT INTO matches (discipline_id, stage, group_name, team1_id, team2_id, score1, score2, winner_id, played_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING id
      `, [discRes.rows[0].id, stage, group_name || null, team1_id, team2_id, score1 ?? null, score2 ?? null, winner_id || null])

      res.status(201).json({ id: result.rows[0].id, message: 'Результат добавлен' })
    } catch (err) {
      console.error('POST /results error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

// PUT /api/results/:id — update match result (admin)
router.put('/:id', requireAuth,
  [
    param('id').isInt().withMessage('Неверный ID'),
    body('score1').optional().isInt({ min: 0 }),
    body('score2').optional().isInt({ min: 0 }),
    body('winner_id').optional().isInt(),
  ],
  validate,
  async (req, res) => {
    try {
      const { score1, score2, winner_id } = req.body

      const existing = await db.query('SELECT * FROM matches WHERE id = $1', [req.params.id])
      if (existing.rows.length === 0) {
        return res.status(404).json({ message: 'Матч не найден' })
      }

      const current = existing.rows[0]
      const result = await db.query(`
        UPDATE matches SET
          score1 = $1, score2 = $2, winner_id = $3, played_at = NOW()
        WHERE id = $4
        RETURNING *
      `, [
        score1 ?? current.score1,
        score2 ?? current.score2,
        winner_id ?? current.winner_id,
        req.params.id,
      ])

      res.json(result.rows[0])
    } catch (err) {
      console.error('PUT /results/:id error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

// DELETE /api/results/:id — delete match (admin)
router.delete('/:id', requireAuth,
  [param('id').isInt().withMessage('Неверный ID')],
  validate,
  async (req, res) => {
    try {
      const result = await db.query('DELETE FROM matches WHERE id = $1 RETURNING id', [req.params.id])
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Матч не найден' })
      }
      res.json({ message: 'Матч удалён' })
    } catch (err) {
      console.error('DELETE /results/:id error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

module.exports = router
