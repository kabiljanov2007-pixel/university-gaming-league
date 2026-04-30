const router = require('express').Router()
const { requireAuth } = require('../middleware/auth')
const db = require('../config/db')

// GET /api/stats — admin dashboard stats
router.get('/', requireAuth, async (req, res) => {
  try {
    const [teamsTotal, teamsApproved, teamsPending, teamsRejected, newsTotal, pubgTeams, ffTeams] = await Promise.all([
      db.query('SELECT COUNT(*)::int AS count FROM teams'),
      db.query("SELECT COUNT(*)::int AS count FROM teams WHERE status = 'approved'"),
      db.query("SELECT COUNT(*)::int AS count FROM teams WHERE status = 'pending'"),
      db.query("SELECT COUNT(*)::int AS count FROM teams WHERE status = 'rejected'"),
      db.query('SELECT COUNT(*)::int AS count FROM news'),
      db.query("SELECT COUNT(*)::int AS count FROM teams t JOIN disciplines d ON d.id = t.discipline_id WHERE d.slug = 'pubg'"),
      db.query("SELECT COUNT(*)::int AS count FROM teams t JOIN disciplines d ON d.id = t.discipline_id WHERE d.slug = 'freefire'"),
    ])

    res.json({
      teams: {
        total: teamsTotal.rows[0].count,
        approved: teamsApproved.rows[0].count,
        pending: teamsPending.rows[0].count,
        rejected: teamsRejected.rows[0].count,
      },
      disciplines: {
        pubg: pubgTeams.rows[0].count,
        freefire: ffTeams.rows[0].count,
      },
      news: {
        total: newsTotal.rows[0].count,
      },
    })
  } catch (err) {
    console.error('GET /stats error:', err)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
})

module.exports = router
