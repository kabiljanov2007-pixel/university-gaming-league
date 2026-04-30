const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body } = require('express-validator')
const { validate } = require('../middleware/validate')
const db = require('../config/db')

// POST /api/auth/login
router.post('/login',
  [
    body('username').trim().notEmpty().withMessage('Введите логин'),
    body('password').notEmpty().withMessage('Введите пароль'),
  ],
  validate,
  async (req, res) => {
    try {
      const { username, password } = req.body

      const result = await db.query(
        'SELECT * FROM admins WHERE username = $1',
        [username]
      )

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Неверный логин или пароль' })
      }

      const admin = result.rows[0]
      const valid = await bcrypt.compare(password, admin.password_hash)

      if (!valid) {
        return res.status(401).json({ message: 'Неверный логин или пароль' })
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )

      res.json({
        token,
        admin: { id: admin.id, username: admin.username }
      })
    } catch (err) {
      console.error('Login error:', err)
      res.status(500).json({ message: 'Ошибка сервера' })
    }
  }
)

// GET /api/auth/me — check token validity
router.get('/me', require('../middleware/auth').requireAuth, (req, res) => {
  res.json({ admin: req.admin })
})

module.exports = router
