import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Lock, Gamepad2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import api from '../hooks/useApi'

export default function AdminLogin() {
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', data)
      login(res.data.token, res.data.admin)
      toast.success('Добро пожаловать!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Неверные данные')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
      </div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="login-header">
          <div className="login-logo">
            <Gamepad2 size={28} />
          </div>
          <h1>Панель администратора</h1>
          <p>University Gaming League 2026</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label className="form-label">Логин</label>
            <input
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="admin"
              {...register('username', { required: 'Введите логин' })}
            />
            {errors.username && <p className="form-error">{errors.username.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Пароль</label>
            <div className="pass-wrap">
              <input
                className={`form-input ${errors.password ? 'error' : ''}`}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', { required: 'Введите пароль' })}
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
            {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <Lock size={16} />}
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="login-back">
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>← Вернуться на сайт</a>
        </div>
      </motion.div>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          position: relative;
          padding: 24px;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }

        .login-orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
          top: -100px;
          right: -100px;
        }

        .login-orb-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
          bottom: -50px;
          left: -50px;
        }

        .login-card {
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border-cyan);
          border-radius: var(--radius-lg);
          padding: 48px 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 0 60px rgba(0, 212, 255, 0.08);
        }

        .login-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .login-logo {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, var(--cyan), #0099cc);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          margin: 0 auto 20px;
          box-shadow: var(--glow-cyan);
        }

        .login-header h1 {
          font-family: var(--font-game);
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .login-header p {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .pass-wrap { position: relative; }

        .pass-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          padding: 4px;
          display: flex;
          align-items: center;
          background: none;
          border: none;
        }

        .pass-toggle:hover { color: var(--cyan); }

        .login-submit {
          width: 100%;
          justify-content: center;
          padding: 14px;
          margin-top: 8px;
        }

        .login-back {
          text-align: center;
          margin-top: 24px;
        }
      `}</style>
    </div>
  )
}
