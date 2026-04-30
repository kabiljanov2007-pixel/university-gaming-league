import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Shield, Gamepad2 } from 'lucide-react'
import api from '../hooks/useApi'

const disciplineLabel = { pubg: '🎯 PUBG Mobile', freefire: '🔥 Free Fire' }
const statusLabel = { approved: 'Принята', pending: 'На проверке', rejected: 'Отклонена' }
const statusColor = { approved: 'badge-cyan', pending: 'badge-purple', rejected: 'badge-purple' }

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.06 } } }

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/teams')
      .then(res => { setTeams(res.data); setError(null) })
      .catch(err => setError(err.response?.data?.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = teams.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.university.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || t.discipline_slug === filter
    return matchSearch && matchFilter
  })

  const pubgCount = teams.filter(t => t.discipline_slug === 'pubg').length
  const ffCount = teams.filter(t => t.discipline_slug === 'freefire').length

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-cyan" style={{ marginBottom: '16px' }}>
              <Users size={12} />
              Участники
            </span>
            <h1 className="section-title">
              Зарегистрированные <span className="gradient-cyan">команды</span>
            </h1>
            <p className="section-subtitle">
              {loading ? 'Загрузка...' : teams.length > 0
                ? `${teams.length} команд подтверждено`
                : 'Регистрация ещё не началась'}
            </p>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
            <span className="badge badge-cyan"><Gamepad2 size={12} /> PUBG Mobile: {pubgCount}</span>
            <span className="badge badge-purple"><Gamepad2 size={12} /> Free Fire: {ffCount}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="teams-controls">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                className="form-input search-input"
                placeholder="Поиск по названию или университету..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-tabs">
              {[
                { value: 'all', label: 'Все' },
                { value: 'pubg', label: '🎯 PUBG' },
                { value: 'freefire', label: '🔥 Free Fire' },
              ].map(f => (
                <button
                  key={f.value}
                  className={`filter-tab ${filter === f.value ? 'active' : ''}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="loading-spinner" />
              <p>Загрузка команд...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <Users size={48} />
              <p>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <p>{teams.length === 0 ? 'Пока нет зарегистрированных команд' : 'Команды не найдены'}</p>
            </div>
          ) : (
            <motion.div
              className="teams-grid"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {filtered.map(team => (
                <motion.div key={team.id} className="team-card" variants={fadeUp}>
                  <div className="team-card-header">
                    <div className={`team-avatar team-avatar-${team.discipline_slug}`}>
                      {team.name.charAt(0)}
                    </div>
                    <div className="team-info">
                      <h3 className="team-name">{team.name}</h3>
                      <p className="team-university">{team.university}</p>
                    </div>
                    <span className={`badge ${statusColor[team.status] || 'badge-purple'}`}>
                      {statusLabel[team.status] || team.status}
                    </span>
                  </div>

                  <div className="team-meta">
                    <div className="meta-item">
                      <Gamepad2 size={14} />
                      <span>{disciplineLabel[team.discipline_slug] || team.discipline_name}</span>
                    </div>
                    <div className="meta-item">
                      <Users size={14} />
                      <span>{team.members_count} игрока</span>
                    </div>
                    <div className="meta-item">
                      <Shield size={14} />
                      <span>Кап: {team.captain_name}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <style>{`
        .teams-controls {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 240px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input { padding-left: 40px !important; }

        .filter-tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 9px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--bg-card);
          border: 1px solid var(--border);
          transition: all var(--transition);
        }

        .filter-tab:hover { border-color: var(--border-cyan); color: var(--cyan); }
        .filter-tab.active { background: var(--cyan-dim); border-color: var(--border-cyan); color: var(--cyan); }

        .teams-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .team-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all var(--transition);
        }

        .team-card:hover {
          border-color: var(--border-cyan);
          box-shadow: var(--glow-cyan);
        }

        .team-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .team-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-game);
          font-size: 1.2rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .team-avatar-pubg {
          background: var(--cyan-dim);
          border: 1px solid var(--border-cyan);
          color: var(--cyan);
        }

        .team-avatar-freefire {
          background: var(--purple-dim);
          border: 1px solid var(--border-purple);
          color: #a78bfa;
        }

        .team-info { flex: 1; min-width: 0; }

        .team-name {
          font-family: var(--font-game);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.03em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .team-university {
          font-size: 0.78rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .team-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .meta-item svg { color: var(--cyan); opacity: 0.7; }

        .empty-state {
          text-align: center;
          padding: 80px 0;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--cyan);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .teams-grid { grid-template-columns: 1fr; }
          .teams-controls { flex-direction: column; }
        }
      `}</style>
    </>
  )
}
