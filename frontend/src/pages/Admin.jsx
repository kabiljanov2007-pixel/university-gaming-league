import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Newspaper, Trophy,
  LogOut, Gamepad2, Check, X, Eye, Trash2,
  ChevronRight, TrendingUp, Clock, Plus
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import api from '../hooks/useApi'

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Дашборд' },
  { to: '/admin/teams', icon: <Users size={18} />, label: 'Команды' },
  { to: '/admin/news', icon: <Newspaper size={18} />, label: 'Новости' },
  { to: '/admin/results', icon: <Trophy size={18} />, label: 'Результаты' },
]

const fmt = (iso) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })

export default function Admin() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    toast.success('Вы вышли из системы')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-logo-icon"><Gamepad2 size={20} /></div>
          <div>
            <div style={{ fontFamily: 'var(--font-game)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em' }}>UNIVERSITY <span style={{ color: 'var(--cyan)' }}>GAMING</span></div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-game)', letterSpacing: '0.1em' }}>LEAGUE · ADMIN</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-nav-item ${pathname === item.to ? 'active' : ''}`}
              end={item.to === '/admin'}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-user">
          <div className="admin-user-info">
            <div className="admin-avatar">{admin?.username?.charAt(0)?.toUpperCase() || 'A'}</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{admin?.username || 'Admin'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Администратор</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout} title="Выйти">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="results" element={<AdminResults />} />
        </Routes>
      </main>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-primary);
        }

        .admin-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px;
          border-bottom: 1px solid var(--border);
        }

        .admin-logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--cyan), #0099cc);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
        }

        .admin-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition);
          text-decoration: none;
        }

        .admin-nav-item:hover {
          background: var(--bg-card);
          color: var(--text-primary);
        }

        .admin-nav-item.active {
          background: var(--cyan-dim);
          color: var(--cyan);
          border: 1px solid var(--border-cyan);
        }

        .admin-user {
          padding: 16px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--purple), var(--pink));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-game);
          font-size: 0.85rem;
          font-weight: 800;
          color: #fff;
        }

        .admin-logout-btn {
          color: var(--text-muted);
          padding: 6px;
          border-radius: 6px;
          background: none;
          border: 1px solid transparent;
          display: flex;
          align-items: center;
          transition: all var(--transition);
        }

        .admin-logout-btn:hover {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.1);
        }

        .admin-main {
          margin-left: 240px;
          flex: 1;
          padding: 32px;
          min-height: 100vh;
        }

        .admin-page-title {
          font-family: var(--font-game);
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .admin-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .admin-stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-stat-icon {
          color: var(--cyan);
          margin-bottom: 4px;
        }

        .admin-stat-value {
          font-family: var(--font-game);
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .admin-stat-label {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--bg-card);
          border-radius: var(--radius);
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .admin-table th {
          padding: 14px 16px;
          text-align: left;
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-bottom: 1px solid var(--border);
          background: var(--bg-secondary);
        }

        .admin-table td {
          padding: 14px 16px;
          font-size: 0.88rem;
          color: var(--text-secondary);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: rgba(255,255,255,0.02); }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: 1px solid var(--border);
          color: var(--text-muted);
          transition: all var(--transition);
        }

        .action-btn:hover { border-color: var(--border-cyan); color: var(--cyan); }
        .action-btn.danger:hover { border-color: rgba(239,68,68,0.4); color: #ef4444; background: rgba(239,68,68,0.1); }
        .action-btn.success:hover { border-color: rgba(34,197,94,0.4); color: #22c55e; background: rgba(34,197,94,0.1); }

        .admin-loading {
          text-align: center;
          padding: 48px;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .loading-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid var(--border);
          border-top-color: var(--cyan);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .news-form-card {
          background: var(--bg-card);
          border: 1px solid var(--border-cyan);
          border-radius: var(--radius);
          padding: 24px;
          margin-bottom: 24px;
        }

        .news-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .news-form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 16px;
        }

        @media (max-width: 1024px) {
          .admin-stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentTeams, setRecentTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/stats'), api.get('/teams/admin/all')])
      .then(([statsRes, teamsRes]) => {
        setStats(statsRes.data)
        setRecentTeams(teamsRes.data.slice(0, 5))
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="admin-page-title">Дашборд</h1>
      <div className="admin-loading"><div className="loading-spinner" /><p>Загрузка...</p></div>
    </motion.div>
  )

  const statCards = stats ? [
    { icon: <Users size={20} />, value: stats.teams.total, label: 'Заявок всего' },
    { icon: <Check size={20} />, value: stats.teams.approved, label: 'Подтверждено' },
    { icon: <Clock size={20} />, value: stats.teams.pending, label: 'На проверке' },
    { icon: <Newspaper size={20} />, value: stats.news.total, label: 'Новостей' },
  ] : []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="admin-page-title">Дашборд</h1>

      <div className="admin-stat-grid">
        {statCards.map((s, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-icon">{s.icon}</div>
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-game)', fontSize: '0.85rem', color: 'var(--cyan)', letterSpacing: '0.1em' }}>
          ПОСЛЕДНИЕ ЗАЯВКИ
        </h2>
        <Link to="/admin/teams" style={{ fontSize: '0.82rem', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 4 }}>
          Все команды <ChevronRight size={14} />
        </Link>
      </div>

      {recentTeams.length === 0 ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Заявок пока нет
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Команда</th>
              <th>Дисциплина</th>
              <th>Университет</th>
              <th>Статус</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {recentTeams.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</td>
                <td>{t.discipline_name}</td>
                <td>{t.university}</td>
                <td>
                  <span className={`badge ${t.status === 'approved' ? 'badge-cyan' : 'badge-purple'}`}>
                    {t.status === 'approved' ? 'Принята' : t.status === 'pending' ? 'Проверка' : 'Отклонена'}
                  </span>
                </td>
                <td>{fmt(t.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  )
}

function AdminTeams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/teams/admin/all')
      .then(res => setTeams(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/teams/${id}/status`, { status })
      setTeams(prev => prev.map(t => t.id === id ? { ...t, status } : t))
      toast.success(status === 'approved' ? 'Команда принята!' : status === 'rejected' ? 'Команда отклонена' : 'Статус обновлён')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка обновления')
    }
  }

  const deleteTeam = async (id, name) => {
    if (!window.confirm(`Удалить команду "${name}"?`)) return
    try {
      await api.delete(`/teams/${id}`)
      setTeams(prev => prev.filter(t => t.id !== id))
      toast.success('Команда удалена')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка удаления')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="admin-page-title">Управление командами</h1>

      {loading ? (
        <div className="admin-loading"><div className="loading-spinner" /><p>Загрузка...</p></div>
      ) : teams.length === 0 ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Заявок пока нет
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Команда</th>
              <th>Дисциплина</th>
              <th>Университет</th>
              <th>Капитан</th>
              <th>Игроков</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</td>
                <td>{t.discipline_name}</td>
                <td>{t.university}</td>
                <td>{t.captain_name}</td>
                <td style={{ textAlign: 'center' }}>{t.members_count}</td>
                <td>
                  <span className={`badge ${t.status === 'approved' ? 'badge-cyan' : 'badge-purple'}`}>
                    {t.status === 'approved' ? 'Принята' : t.status === 'pending' ? 'Проверка' : 'Отклонена'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {t.status === 'pending' && (
                      <>
                        <button className="action-btn success" onClick={() => updateStatus(t.id, 'approved')} title="Принять">
                          <Check size={14} />
                        </button>
                        <button className="action-btn danger" onClick={() => updateStatus(t.id, 'rejected')} title="Отклонить">
                          <X size={14} />
                        </button>
                      </>
                    )}
                    {t.status === 'approved' && (
                      <button className="action-btn" onClick={() => updateStatus(t.id, 'pending')} title="Вернуть на проверку">
                        <X size={14} />
                      </button>
                    )}
                    {t.status === 'rejected' && (
                      <button className="action-btn success" onClick={() => updateStatus(t.id, 'approved')} title="Принять">
                        <Check size={14} />
                      </button>
                    )}
                    <button className="action-btn danger" onClick={() => deleteTeam(t.id, t.name)} title="Удалить">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  )
}

function AdminNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', tag: 'Анонс', content: '', published: true })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/news/admin/all')
      .then(res => setNews(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const createArticle = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Заполните заголовок и содержание')
      return
    }
    setSaving(true)
    try {
      const res = await api.post('/news', form)
      setNews(prev => [res.data, ...prev])
      setShowForm(false)
      setForm({ title: '', tag: 'Анонс', content: '', published: true })
      toast.success('Статья опубликована!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const deleteArticle = async (id, title) => {
    if (!window.confirm(`Удалить статью "${title}"?`)) return
    try {
      await api.delete(`/news/${id}`)
      setNews(prev => prev.filter(n => n.id !== id))
      toast.success('Статья удалена')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка удаления')
    }
  }

  const viewArticle = (id) => {
    window.open(`/news/${id}`, '_blank')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Управление новостями</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          <Plus size={16} /> {showForm ? 'Отмена' : 'Новая статья'}
        </button>
      </div>

      {showForm && (
        <div className="news-form-card">
          <h2 style={{ fontFamily: 'var(--font-game)', fontSize: '0.85rem', color: 'var(--cyan)', letterSpacing: '0.1em', marginBottom: 16 }}>
            НОВАЯ СТАТЬЯ
          </h2>
          <form onSubmit={createArticle}>
            <div className="news-form-grid">
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Заголовок *</label>
                <input
                  className="form-input"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="Заголовок статьи"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Тег</label>
                <select className="form-input" name="tag" value={form.tag} onChange={handleFormChange}>
                  <option>Анонс</option>
                  <option>Официально</option>
                  <option>Организация</option>
                  <option>Партнёры</option>
                  <option>Результаты</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Содержание * (поддерживается markdown: ## заголовок, **жирный**, - список)</label>
              <textarea
                className="form-input"
                name="content"
                value={form.content}
                onChange={handleFormChange}
                placeholder="Текст статьи..."
                rows={8}
                style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }}
                required
              />
            </div>
            <div className="news-form-actions">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" name="published" checked={form.published} onChange={handleFormChange} />
                Опубликовать сразу
              </label>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-loading"><div className="loading-spinner" /><p>Загрузка...</p></div>
      ) : news.length === 0 ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Новостей пока нет
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Заголовок</th>
              <th>Тег</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {news.map(n => (
              <tr key={n.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{n.title}</td>
                <td><span className="badge badge-purple">{n.tag}</span></td>
                <td>{fmt(n.created_at)}</td>
                <td><span className={`badge ${n.published ? 'badge-cyan' : 'badge-purple'}`}>{n.published ? 'Опубликовано' : 'Черновик'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="action-btn" title="Просмотр" onClick={() => viewArticle(n.id)}><Eye size={14} /></button>
                    <button className="action-btn danger" title="Удалить" onClick={() => deleteArticle(n.id, n.title)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  )
}

function AdminResults() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="admin-page-title">Управление результатами</h1>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '48px',
        textAlign: 'center',
        color: 'var(--text-muted)'
      }}>
        <TrendingUp size={48} style={{ color: 'var(--cyan)', margin: '0 auto 16px' }} />
        <p style={{ fontSize: '1rem' }}>Управление результатами доступно с 15 мая 2026</p>
        <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Здесь вы сможете вводить результаты матчей в реальном времени</p>
      </div>
    </motion.div>
  )
}
