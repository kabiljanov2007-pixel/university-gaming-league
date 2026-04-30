const router = require('express').Router()
const { body, param } = require('express-validator')
const { validate } = require('../middleware/validate')
const { requireAuth } = require('../middleware/auth')
const db = require('../config/db')

// ─── PUBLIC ──────────────────────────────────────────────────────────────────

// GET /api/teams — approved teams (public)
router.get('/', async (req, res) => {
  try {
    const { discipline } = req.query

    let sql = `
      SELECT
        t.id, t.name, t.university, t.captain_name,
        t.status, t.created_at,
        d.name AS discipline_name, d.slug AS discipline_slug,
        COUNT(tm.id)::int AS members_count
      FROM teams t
      LEFT JOIN disciplines d ON t.discipline_id = d.id
      LEFT JOIN team_members tm ON tm.team_id = t.id
      WHERE t.status = 'approved'
    `
    const params = []

    if (discipline) {
      params.push(discipline)
      sql += ` AND d.slug = $${params.length}`
    }

    sql += ' GROUP BY t.id, d.name, d.slug ORDER BY t.created_at DESC'

    const result = await db.query(sql, params)
    res.json(result.rows)
  } catch (err) {
    console.error('GET /teams error:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// GET /api/teams/:id — single team with members (public)
router.get('/:id',
  [param('id').isInt().withMessage('Неверный ID')],
  validate,
  async (req, res) => {
    try {
      const teamRes = await db.query(`
        SELECT t.*, d.name AS discipline_name, d.slug AS discipline_slug
        FROM teams t
        LEFT JOIN disciplines d ON t.discipline_id = d.id
        WHERE t.id = $1 AND t.status = 'approved'
      `, [req.params.id])

      if (teamRes.rows.length === 0) {
        return res.status(404).json({ message: 'Команда не найдена' })
      }

      const membersRes = await db.query(
        'SELECT id, name, game_nickname, student_id, is_captain FROM team_members WHERE team_id = $1 ORDER BY is_captain DESC',
        [req.params.id]
      )

      res.json({ ...teamRes.rows[0], members: membersRes.rows })
    } catch (err) {
      console.error('GET /teams/:id error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

// POST /api/teams/register — register a team (public)
router.post('/register',
  [
    body('discipline').isIn(['pubg', 'freefire']).withMessage('Выбери дисциплину'),
    body('teamName').trim().isLength({ min: 2, max: 100 }).withMessage('Название команды: 2–100 символов'),
    body('university').trim().notEmpty().withMessage('Выбери университет'),
    body('contactName').trim().notEmpty().withMessage('Введите имя капитана'),
    body('contactPhone').trim().notEmpty().withMessage('Введите номер телефона'),
    body('members').isArray({ min: 4, max: 4 }).withMessage('Команда должна состоять из 4 игроков'),
    body('members.*.name').trim().notEmpty().withMessage('Укажите имя каждого игрока'),
    body('members.*.gameNickname').trim().notEmpty().withMessage('Укажите ник каждого игрока'),
    body('members.*.studentId').trim().notEmpty().withMessage('Укажите номер студ. билета'),
  ],
  validate,
  async (req, res) => {
    const client = await db.getClient()
    try {
      await client.query('BEGIN')

      // Check for duplicate team name in same discipline
      const dupCheck = await client.query(`
        SELECT t.id FROM teams t
        JOIN disciplines d ON d.id = t.discipline_id
        WHERE LOWER(t.name) = LOWER($1) AND d.slug = $2
      `, [req.body.teamName, req.body.discipline])

      if (dupCheck.rows.length > 0) {
        await client.query('ROLLBACK')
        return res.status(409).json({ message: 'Команда с таким названием уже зарегистрирована в этой дисциплине' })
      }

      // Get discipline id
      const discRes = await client.query('SELECT id FROM disciplines WHERE slug = $1', [req.body.discipline])
      if (discRes.rows.length === 0) {
        await client.query('ROLLBACK')
        return res.status(400).json({ message: 'Неверная дисциплина' })
      }
      const disciplineId = discRes.rows[0].id

      // Insert team
      const teamRes = await client.query(`
        INSERT INTO teams (name, discipline_id, university, captain_name, captain_phone, captain_telegram, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'pending')
        RETURNING id
      `, [
        req.body.teamName,
        disciplineId,
        req.body.university,
        req.body.contactName,
        req.body.contactPhone,
        req.body.contactTelegram || null,
      ])

      const teamId = teamRes.rows[0].id

      // Insert members
      for (let i = 0; i < req.body.members.length; i++) {
        const m = req.body.members[i]
        await client.query(`
          INSERT INTO team_members (team_id, name, game_nickname, student_id, is_captain)
          VALUES ($1, $2, $3, $4, $5)
        `, [teamId, m.name, m.gameNickname, m.studentId, i === 0])
      }

      await client.query('COMMIT')

      res.status(201).json({
        message: 'Заявка успешно подана! Ожидайте подтверждения.',
        teamId,
      })
    } catch (err) {
      await client.query('ROLLBACK')
      console.error('POST /teams/register error:', err)
      res.status(500).json({ message: 'Ошибка сервера при регистрации' })
    } finally {
      client.release()
    }
  }
)

// ─── ADMIN ───────────────────────────────────────────────────────────────────

// GET /api/teams/admin/all — all teams including pending (admin)
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    const { status, discipline } = req.query

    let sql = `
      SELECT
        t.id, t.name, t.university, t.captain_name, t.captain_phone,
        t.captain_telegram, t.status, t.created_at,
        d.name AS discipline_name, d.slug AS discipline_slug,
        COUNT(tm.id)::int AS members_count
      FROM teams t
      LEFT JOIN disciplines d ON t.discipline_id = d.id
      LEFT JOIN team_members tm ON tm.team_id = t.id
      WHERE 1=1
    `
    const params = []

    if (status) {
      params.push(status)
      sql += ` AND t.status = $${params.length}`
    }
    if (discipline) {
      params.push(discipline)
      sql += ` AND d.slug = $${params.length}`
    }

    sql += ' GROUP BY t.id, d.name, d.slug ORDER BY t.created_at DESC'

    const result = await db.query(sql, params)
    res.json(result.rows)
  } catch (err) {
    console.error('GET /teams/admin/all error:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

// GET /api/teams/admin/:id — team details with members (admin)
router.get('/admin/:id', requireAuth,
  [param('id').isInt()],
  validate,
  async (req, res) => {
    try {
      const teamRes = await db.query(`
        SELECT t.*, d.name AS discipline_name, d.slug AS discipline_slug
        FROM teams t
        LEFT JOIN disciplines d ON t.discipline_id = d.id
        WHERE t.id = $1
      `, [req.params.id])

      if (teamRes.rows.length === 0) {
        return res.status(404).json({ message: 'Команда не найдена' })
      }

      const membersRes = await db.query(
        'SELECT * FROM team_members WHERE team_id = $1 ORDER BY is_captain DESC',
        [req.params.id]
      )

      res.json({ ...teamRes.rows[0], members: membersRes.rows })
    } catch (err) {
      console.error('GET /teams/admin/:id error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

// PATCH /api/teams/:id/status — update status (admin)
router.patch('/:id/status', requireAuth,
  [
    param('id').isInt().withMessage('Неверный ID'),
    body('status').isIn(['approved', 'rejected', 'pending']).withMessage('Неверный статус'),
  ],
  validate,
  async (req, res) => {
    try {
      const result = await db.query(
        'UPDATE teams SET status = $1 WHERE id = $2 RETURNING id, name, status',
        [req.body.status, req.params.id]
      )
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Команда не найдена' })
      }
      res.json(result.rows[0])
    } catch (err) {
      console.error('PATCH /teams/:id/status error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

// DELETE /api/teams/:id — delete team (admin)
router.delete('/:id', requireAuth,
  [param('id').isInt().withMessage('Неверный ID')],
  validate,
  async (req, res) => {
    try {
      const result = await db.query(
        'DELETE FROM teams WHERE id = $1 RETURNING id',
        [req.params.id]
      )
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Команда не найдена' })
      }
      res.json({ message: 'Команда удалена' })
    } catch (err) {
      console.error('DELETE /teams/:id error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

module.exports = router
