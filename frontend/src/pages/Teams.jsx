import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, Shield, Gamepad2, X, Phone, Mail, Crown } from 'lucide-react'
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
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    api.get('/teams')
      .then(res => { setTeams(res.data); setError(null) })
      .catch(err => setError(err.response?.data?.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [])

  const openTeam = async (team) => {
    setSelectedTeam({ ...team, members: null })
    setModalLoading(true)
    try {
      const res = await api.get(`/teams/${team.id}`)
      setSelectedTeam(res.data)
    } catch {
      setSelectedTeam(prev => ({ ...prev, members: [] }))
    } finally {
      setModalLoading(false)
    }
  }

  const closeModal = () => setSelectedTeam(null)

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
                ? `${teams.length} команд зарегистрировано`
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
                <motion.div
                  key={team.id}
                  className="team-card"
                  variants={fadeUp}
                  onClick={() => openTeam(team)}
                  style={{ cursor: 'pointer' }}
                >
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

                  <div className="team-card-hint">Нажмите, чтобы увидеть состав →</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-box"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-team-title">
                  <div className={`team-avatar team-avatar-${selectedTeam.discipline_slug}`} style={{ width: 52, height: 52, fontSize: '1.3rem' }}>
                    {selectedTeam.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="modal-team-name">{selectedTeam.name}</h2>
                    <p className="modal-team-sub">{selectedTeam.university}</p>
                  </div>
                </div>
                <button className="modal-close" onClick={closeModal}><X size={20} /></button>
              </div>

              <div className="modal-info-row">
                <span className="modal-info-pill">{disciplineLabel[selectedTeam.discipline_slug] || selectedTeam.discipline_name}</span>
                <span className={`badge ${statusColor[selectedTeam.status] || 'badge-purple'}`}>{statusLabel[selectedTeam.status]}</span>
              </div>

              <div className="modal-contact-row">
                <div className="modal-contact-item">
                  <Phone size={14} />
                  <span>{selectedTeam.captain_phone}</span>
                </div>
                {selectedTeam.captain_telegram && (
                  <div className="modal-contact-item">
                    <Mail size={14} />
                    <span>{selectedTeam.captain_telegram}</span>
                  </div>
                )}
              </div>

              <div className="modal-members-label">Состав команды</div>

              {modalLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
                  <div className="loading-spinner" />
                </div>
              ) : (
                <div className="modal-members-grid">
                  {(selectedTeam.members || []).map((m, i) => (
                    <div key={m.id || i} className={`modal-player ${m.is_captain ? 'modal-player-captain' : ''}`}>
                      <div className="modal-player-top">
                        {m.is_captain
                          ? <span className="modal-player-role captain-role"><Crown size={12} /> КАПИТАН</span>
                          : <span className="modal-player-role">ИГРОК {i + 1}</span>
                        }
                        <span className="modal-player-num">#{i + 1}</span>
                      </div>
                      <div className="modal-player-nick">{m.game_nickname}</div>
                      <div className="modal-player-details">
                        <div className="modal-detail-row">
                          <span className="modal-detail-label">Имя</span>
                          <span className="modal-detail-val">{m.name}</span>
                        </div>
                        <div className="modal-detail-row">
                          <span className="modal-detail-label">Студ. билет</span>
                          <span className="modal-detail-val">{m.student_id}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          transform: translateY(-2px);
        }

        .team-card-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: right;
          letter-spacing: 0.03em;
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

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
          backdrop-filter: blur(4px);
        }

        .modal-box {
          background: var(--bg-card);
          border: 1px solid var(--border-cyan);
          border-radius: var(--radius-lg);
          padding: 28px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--glow-cyan);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
        }

        .modal-team-title {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .modal-team-name {
          font-family: var(--font-game);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 0.04em;
        }

        .modal-team-sub {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all var(--transition);
        }
        .modal-close:hover { border-color: var(--border-cyan); color: var(--cyan); }

        .modal-info-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .modal-info-pill {
          font-size: 0.82rem;
          padding: 4px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 20px;
          color: var(--text-secondary);
        }

        .modal-contact-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }

        .modal-contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .modal-contact-item svg { color: var(--cyan); }

        .modal-members-label {
          font-family: var(--font-game);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--cyan);
          margin-bottom: 14px;
        }

        .modal-members-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .modal-player {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px 16px;
          transition: border-color 0.2s;
        }

        .modal-player-captain {
          border-color: var(--cyan);
          background: var(--cyan-dim);
        }

        .modal-player-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .modal-player-role {
          font-family: var(--font-game);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .captain-role { color: #ffd700; }

        .modal-player-num {
          font-family: var(--font-game);
          font-size: 0.62rem;
          color: var(--text-muted);
        }

        .modal-player-nick {
          font-family: var(--font-game);
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 0.03em;
          margin-bottom: 8px;
          word-break: break-all;
        }

        .modal-player-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .modal-detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          padding: 3px 0;
          border-bottom: 1px solid var(--border);
        }
        .modal-detail-row:last-child { border-bottom: none; }
        .modal-detail-label { color: var(--text-muted); }
        .modal-detail-val { color: var(--text-primary); font-weight: 500; text-align: right; word-break: break-all; }

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
          .modal-members-grid { grid-template-columns: 1fr; }
          .modal-box { padding: 20px 16px; }
        }
      `}</style>
    </>
  )
}
