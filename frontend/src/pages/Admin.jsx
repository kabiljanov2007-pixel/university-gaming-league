import { useState, useEffect, Fragment } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Newspaper, Trophy,
  LogOut, Gamepad2, Check, X, Eye, Trash2,
  ChevronRight, TrendingUp, Clock, Plus, Download
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import api from '../hooks/useApi'
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType } from 'docx'
import { saveAs } from 'file-saver'

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Дашборд' },
  { to: '/admin/teams', icon: <Users size={18} />, label: 'Команды' },
  { to: '/admin/news', icon: <Newspaper size={18} />, label: 'Новости' },
  { to: '/admin/results', icon: <Trophy size={18} />, label: 'Результаты' },
]

const fmt = (iso) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
const fmtDateTime = (iso) => new Date(iso).toLocaleString('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

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
          width: 190px;
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
          gap: 10px;
          padding: 18px 14px;
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
          gap: 10px;
          padding: 9px 11px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
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
          padding: 12px;
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
          margin-left: 190px;
          flex: 1;
          padding: 18px;
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

        .admin-table-wrap {
          overflow-x: auto;
          border: 1px solid var(--border);
          border-radius: var(--radius);
        }

        .admin-table th {
          padding: 10px 12px;
          text-align: left;
          font-size: 0.68rem;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-bottom: 1px solid var(--border);
          background: var(--bg-secondary);
        }

        .admin-table td {
          padding: 10px 12px;
          font-size: 0.8rem;
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

        @media (max-width: 900px) {
          .admin-layout { flex-direction: column; }
          .admin-sidebar {
            position: sticky;
            width: 100%;
            top: 0;
            bottom: auto;
            height: auto;
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          .admin-logo { padding: 14px 16px; }
          .admin-nav {
            flex-direction: row;
            overflow-x: auto;
            padding: 10px;
            gap: 8px;
          }
          .admin-nav-item {
            white-space: nowrap;
            border: 1px solid var(--border);
            background: var(--bg-card);
          }
          .admin-user { padding: 12px 16px; }
          .admin-main {
            margin-left: 0;
            padding: 18px 14px 24px;
          }
          .admin-table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
        }

        @media (max-width: 640px) {
          .admin-stat-grid { grid-template-columns: 1fr; }
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
  const [expandedId, setExpandedId] = useState(null)
  const [expandedData, setExpandedData] = useState({})
  const [loadingId, setLoadingId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    api.get('/teams/admin/all')
      .then(res => setTeams(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const toggleTeamDetails = async (teamId) => {
    if (expandedId === teamId) { setExpandedId(null); return }
    setExpandedId(teamId)
    // Keep selected row in view so the table doesn't "jump" away from visible names.
    setTimeout(() => {
      const row = document.querySelector(`[data-team-row="${teamId}"]`)
      row?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
    if (expandedData[teamId]) return
    setLoadingId(teamId)
    try {
      const res = await api.get(`/teams/admin/${teamId}`)
      setExpandedData(prev => ({ ...prev, [teamId]: res.data }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Не удалось загрузить данные команды')
      setExpandedId(null)
    } finally {
      setLoadingId(null)
    }
  }

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

  const filteredTeams = teams.filter((t) => statusFilter === 'all' ? true : t.status === statusFilter)

  const downloadWord = async (disciplineSlug) => {
    const discLabel = disciplineSlug === 'pubg' ? 'PUBG Mobile' : 'Free Fire'
    toast(`Генерируем Word — ${discLabel}...`, { icon: '⏳' })
    try {
      const approvedInDisc = teams.filter(
        (t) => t.status === 'approved' && t.discipline_slug === disciplineSlug
      )
      if (approvedInDisc.length === 0) {
        toast.error(`Нет принятых команд по ${discLabel}`)
        return
      }

      const detailed = await Promise.all(
        approvedInDisc.map(async (t) => {
          if (expandedData[t.id]) return { ...t, ...expandedData[t.id] }
          const res = await api.get(`/teams/admin/${t.id}`)
          return { ...t, ...res.data }
        })
      )

      const CYAN = '0099BB'
      const DARK = '1E2A38'

      const cellBorder = (color = 'CCCCCC') => ({
        top: { style: BorderStyle.SINGLE, size: 4, color },
        bottom: { style: BorderStyle.SINGLE, size: 4, color },
        left: { style: BorderStyle.SINGLE, size: 4, color },
        right: { style: BorderStyle.SINGLE, size: 4, color },
      })

      const headerCell = (text, w) => new TableCell({
        width: w ? { size: w, type: WidthType.PERCENTAGE } : undefined,
        borders: cellBorder(CYAN),
        shading: { type: ShadingType.SOLID, color: CYAN },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 20 })],
        })],
      })

      const bodyCell = (text, bold = false, color = '222222', w) => new TableCell({
        width: w ? { size: w, type: WidthType.PERCENTAGE } : undefined,
        borders: cellBorder('DDDDDD'),
        children: [new Paragraph({
          children: [new TextRun({ text: String(text || '—'), bold, size: 20, color })],
        })],
      })

      const children = []

      // Document title
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 80 },
        children: [new TextRun({ text: 'University Gaming League 2026', bold: true, size: 40, color: CYAN })],
      }))
      children.push(new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: `Дисциплина: ${discLabel}  •  Принятые команды: ${detailed.length}`, bold: true, size: 24, color: DARK })],
      }))
      children.push(new Paragraph({
        spacing: { after: 400 },
        children: [new TextRun({ text: `Сформировано: ${new Date().toLocaleString('ru-RU')}`, size: 18, color: '999999', italics: true })],
      }))

      detailed.forEach((team, idx) => {
        // Team name as heading
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 320, after: 120 },
          children: [new TextRun({ text: `${idx + 1}. ${team.name}`, bold: true, size: 30, color: DARK })],
        }))

        // University + Captain info line
        children.push(new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Учебное заведение: ', bold: true, size: 20, color: '555555' }),
            new TextRun({ text: team.university || '—', size: 20 }),
          ],
        }))
        children.push(new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: 'Капитан: ', bold: true, size: 20, color: '555555' }),
            new TextRun({ text: team.captain_name || '—', size: 20 }),
          ],
        }))

        // Members table — роль / имя / ник
        const members = team.members || []
        children.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                headerCell('Роль', 18),
                headerCell('Имя и фамилия', 50),
                headerCell('Игровой ник', 32),
              ],
            }),
            ...members.map((m, i) => new TableRow({
              children: [
                bodyCell(m.is_captain ? 'Капитан' : `Игрок ${i + 1}`, m.is_captain, m.is_captain ? CYAN : '333333', 18),
                bodyCell(m.name, m.is_captain, '111111', 50),
                bodyCell(m.game_nickname, false, '444444', 32),
              ],
            })),
          ],
        }))

        children.push(new Paragraph({ spacing: { after: 160 } }))
      })

      const doc = new Document({
        sections: [{ properties: {}, children }],
        styles: { default: { document: { run: { font: 'Calibri' } } } },
      })

      const blob = await Packer.toBlob(doc)
      saveAs(blob, `UGL2026_${discLabel.replace(' ', '_')}_${new Date().toISOString().slice(0, 10)}.docx`)
      toast.success(`${discLabel} — Word скачан!`)
    } catch (err) {
      console.error(err)
      toast.error('Ошибка при генерации документа')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="admin-page-title">Управление командами</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <button
          className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 14px', fontSize: '0.72rem' }}
          onClick={() => setStatusFilter('all')}
        >
          Все заявки ({teams.length})
        </button>
        <button
          className={`btn ${statusFilter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 14px', fontSize: '0.72rem' }}
          onClick={() => setStatusFilter('pending')}
        >
          Только на проверке ({teams.filter((t) => t.status === 'pending').length})
        </button>
        <button
          className={`btn ${statusFilter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 14px', fontSize: '0.72rem' }}
          onClick={() => setStatusFilter('approved')}
        >
          Принятые ({teams.filter((t) => t.status === 'approved').length})
        </button>
        <button
          className={`btn ${statusFilter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 14px', fontSize: '0.72rem' }}
          onClick={() => setStatusFilter('rejected')}
        >
          Отклонённые ({teams.filter((t) => t.status === 'rejected').length})
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 6, borderColor: 'var(--border-cyan)', color: 'var(--cyan)' }}
            onClick={() => downloadWord('pubg')}
            disabled={!teams.some(t => t.status === 'approved' && t.discipline_slug === 'pubg')}
            title="Скачать принятые команды PUBG Mobile в Word"
          >
            <Download size={13} /> PUBG Mobile
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 6, borderColor: '#ff6b35', color: '#ff8c5a' }}
            onClick={() => downloadWord('freefire')}
            disabled={!teams.some(t => t.status === 'approved' && t.discipline_slug === 'freefire')}
            title="Скачать принятые команды Free Fire в Word"
          >
            <Download size={13} /> Free Fire
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="loading-spinner" /><p>Загрузка...</p></div>
      ) : filteredTeams.length === 0 ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          По выбранному фильтру заявок нет
        </div>
      ) : (
        <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ minWidth: 170 }}>Команда</th>
              <th style={{ minWidth: 130 }}>Дисциплина</th>
              <th style={{ minWidth: 150 }}>Университет</th>
              <th style={{ minWidth: 150 }}>Капитан</th>
              <th style={{ textAlign: 'center', minWidth: 85 }}>Игроков</th>
              <th style={{ minWidth: 150 }}>Отправлено</th>
              <th style={{ minWidth: 110 }}>Статус</th>
              <th style={{ minWidth: 150 }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.map(t => (
              <Fragment key={t.id}>
                <tr data-team-row={t.id} key={t.id} style={{ background: expandedId === t.id ? 'rgba(0,212,255,0.05)' : undefined }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{t.name}</td>
                  <td style={{ fontSize: '0.82rem' }}>{t.discipline_name}</td>
                  <td style={{ fontSize: '0.82rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.university}</td>
                  <td style={{ fontSize: '0.82rem' }}>{t.captain_name}</td>
                  <td style={{ textAlign: 'center', fontSize: '0.82rem' }}>{t.members_count}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{fmtDateTime(t.created_at)}</td>
                  <td>
                    <span className={`badge ${t.status === 'approved' ? 'badge-cyan' : 'badge-purple'}`} style={{ fontSize: '0.62rem', padding: '3px 8px' }}>
                      {t.status === 'approved' ? 'Принята' : t.status === 'pending' ? 'Проверка' : 'Отклонена'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button
                        className="action-btn"
                        onClick={() => toggleTeamDetails(t.id)}
                        title="Состав команды"
                        style={{ background: expandedId === t.id ? 'var(--cyan-dim)' : undefined, borderColor: expandedId === t.id ? 'var(--border-cyan)' : undefined, color: expandedId === t.id ? 'var(--cyan)' : undefined }}
                      >
                        <Eye size={13} />
                      </button>
                      {t.status === 'pending' && (
                        <>
                          <button className="action-btn success" onClick={() => updateStatus(t.id, 'approved')} title="Принять"><Check size={13} /></button>
                          <button className="action-btn danger" onClick={() => updateStatus(t.id, 'rejected')} title="Отклонить"><X size={13} /></button>
                        </>
                      )}
                      {t.status === 'approved' && (
                        <button className="action-btn" onClick={() => updateStatus(t.id, 'pending')} title="На проверку"><X size={13} /></button>
                      )}
                      {t.status === 'rejected' && (
                        <button className="action-btn success" onClick={() => updateStatus(t.id, 'approved')} title="Принять"><Check size={13} /></button>
                      )}
                      <button className="action-btn danger" onClick={() => deleteTeam(t.id, t.name)} title="Удалить"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>

                {expandedId === t.id && (
                  <tr>
                    <td colSpan={8} style={{ padding: 0, background: 'var(--bg-secondary)' }}>
                      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-cyan)', borderBottom: '1px solid var(--border-cyan)', maxHeight: 260, overflowY: 'auto' }}>
                        {loadingId === t.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                            <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                            Загружаем состав...
                          </div>
                        ) : expandedData[t.id] ? (
                          <>
                            <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap', fontSize: '0.8rem' }}>
                              <span style={{ color: 'var(--text-muted)' }}>📞 <span style={{ color: 'var(--text-primary)' }}>{expandedData[t.id].captain_phone || '—'}</span></span>
                              <span style={{ color: 'var(--text-muted)' }}>✉️ <span style={{ color: 'var(--text-primary)' }}>{expandedData[t.id].captain_telegram || '—'}</span></span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8 }}>
                              {(expandedData[t.id].members || []).map((m, i) => (
                                <div key={m.id || i} style={{ border: `1px solid ${m.is_captain ? 'var(--border-cyan)' : 'var(--border)'}`, borderRadius: 8, padding: '8px 10px', background: m.is_captain ? 'rgba(0,212,255,0.07)' : 'rgba(255,255,255,0.02)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <span style={{ fontSize: '0.7rem', color: m.is_captain ? 'var(--cyan)' : 'var(--text-muted)', fontFamily: 'var(--font-game)', letterSpacing: '0.06em' }}>
                                      {m.is_captain ? '👑 КАПИТАН' : `ИГРОК ${i + 1}`}
                                    </span>
                                  </div>
                                  <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: 2 }}>{m.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ник: {m.game_nickname}</div>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        </div>
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
        <p style={{ fontSize: '1rem' }}>Управление результатами доступно с 22 мая 2026</p>
        <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Здесь вы сможете вводить результаты матчей в реальном времени</p>
      </div>
    </motion.div>
  )
}
