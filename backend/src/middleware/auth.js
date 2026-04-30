const jwt = require('jsonwebtoken')

function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Требуется авторизация' })
  }

  const token = header.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = payload
    next()
  } catch {
    return res.status(401).json({ message: 'Недействительный токен' })
  }
}

module.exports = { requireAuth }
