import { motion } from 'framer-motion'
import { Trophy, Clock, Swords, Users } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

const mockBracket = {
  pubg: {
    groups: [
      {
        name: 'Группа A', teams: [
          { name: 'Steppe Lions', points: 45, kills: 23, rank: 1 },
          { name: 'Desert Eagles', points: 38, kills: 19, rank: 2 },
          { name: 'Iron Guards', points: 22, kills: 11, rank: 3 },
          { name: 'Night Riders', points: 15, kills: 7, rank: 4 },
        ]
      },
      {
        name: 'Группа B', teams: [
          { name: 'Shadow Wolves', points: 41, kills: 20, rank: 1 },
          { name: 'Thunder Strike', points: 35, kills: 17, rank: 2 },
          { name: 'Steel Hawks', points: 28, kills: 14, rank: 3 },
          { name: 'Golden Kings', points: 12, kills: 5, rank: 4 },
        ]
      },
    ],
    semifinals: [
      { team1: 'Steppe Lions', team2: 'Thunder Strike', score1: 32, score2: 25, winner: 0 },
      { team1: 'Shadow Wolves', team2: 'Desert Eagles', score1: 28, score2: 30, winner: 1 },
    ],
    final: { team1: 'Steppe Lions', team2: 'Desert Eagles', score1: null, score2: null, status: 'upcoming' },
  }
}

export default function Results() {
  const tournamentDate = new Date('2026-05-15')
  const now = new Date()
  const isUpcoming = now < tournamentDate

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-gold" style={{ marginBottom: '16px' }}>
              <Trophy size={12} />
              Результаты
            </span>
            <h1 className="section-title">
              Турнирная <span className="gradient-cyan">сетка</span>
            </h1>
            <p className="section-subtitle">
              {isUpcoming
                ? 'Турнир состоится 15 мая 2026. Следи за результатами в реальном времени!'
                : 'Результаты и статистика University Gaming League 2026'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {isUpcoming ? (
            <UpcomingView />
          ) : (
            <ResultsView data={mockBracket.pubg} />
          )}
        </div>
      </section>
    </>
  )
}

function UpcomingView() {
  return (
    <motion.div
      className="upcoming-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="upcoming-icon">
        <Clock size={64} />
      </div>
      <h2 style={{ fontFamily: 'var(--font-game)', fontSize: '1.5rem', marginBottom: 12 }}>
        Скоро <span className="gradient-cyan">начнётся</span>
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 400, textAlign: 'center', lineHeight: 1.7 }}>
        Турнирная сетка и результаты будут опубликованы 15 мая 2026 в день проведения турнира.
      </p>

      <div className="upcoming-info-grid">
        {[
          { icon: <Users size={20} />, label: 'PUBG Mobile', value: '16 команд' },
          { icon: <Users size={20} />, label: 'Free Fire', value: '16 команд' },
          { icon: <Swords size={20} />, label: 'Формат', value: 'Групповой + ПО' },
          { icon: <Trophy size={20} />, label: 'Победитель', value: 'TBD — 15 мая' },
        ].map((item, i) => (
          <div key={i} className="upcoming-info-card">
            <div style={{ color: 'var(--cyan)' }}>{item.icon}</div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--font-game)', fontSize: '0.9rem', fontWeight: 700 }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .upcoming-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 0;
          gap: 24px;
        }

        .upcoming-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--cyan-dim);
          border: 2px solid var(--border-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cyan);
          box-shadow: var(--glow-cyan);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .upcoming-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 500px;
          margin-top: 16px;
        }

        .upcoming-info-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          display: flex;
          gap: 14px;
          align-items: center;
        }
      `}</style>
    </motion.div>
  )
}

function ResultsView({ data }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeUp}>
        <h2 style={{ fontFamily: 'var(--font-game)', fontSize: '1rem', color: 'var(--cyan)', letterSpacing: '0.1em', marginBottom: 24 }}>
          ГРУППОВОЙ ЭТАП
        </h2>
        <div className="groups-grid">
          {data.groups.map(group => (
            <div key={group.name} className="group-card">
              <h3 className="group-title">{group.name}</h3>
              <table className="group-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Команда</th>
                    <th>Очки</th>
                    <th>Фраги</th>
                  </tr>
                </thead>
                <tbody>
                  {group.teams.map((t, i) => (
                    <tr key={t.name} className={i < 2 ? 'qualified' : ''}>
                      <td className="rank-cell">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </td>
                      <td className="team-cell">{t.name}</td>
                      <td className="points-cell">{t.points}</td>
                      <td>{t.kills}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 10 }}>
                ↑ Топ-2 выходят в полуфинал
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} style={{ marginTop: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-game)', fontSize: '1rem', color: 'var(--cyan)', letterSpacing: '0.1em', marginBottom: 24 }}>
          ПЛЕЙ-ОФФ
        </h2>

        <div className="bracket-wrap">
          <div className="bracket-col">
            <p className="bracket-col-title">Полуфиналы</p>
            {data.semifinals.map((match, i) => (
              <MatchCard key={i} match={match} />
            ))}
          </div>
          <div className="bracket-arrow">
            <Swords size={24} style={{ color: 'var(--cyan)' }} />
          </div>
          <div className="bracket-col">
            <p className="bracket-col-title">Финал</p>
            <MatchCard match={data.final} isFinal />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MatchCard({ match, isFinal }) {
  const winner = match.winner
  const upcoming = match.status === 'upcoming'

  return (
    <div className={`match-card ${isFinal ? 'match-final' : ''}`}>
      {isFinal && <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontFamily: 'var(--font-game)', letterSpacing: '0.1em', marginBottom: 10 }}>🏆 ГРАНД ФИНАЛ</div>}
      {[match.team1, match.team2].map((team, i) => (
        <div key={i} className={`match-team ${!upcoming && winner === i ? 'match-winner' : !upcoming && winner !== i ? 'match-loser' : ''}`}>
          <span className="match-team-name">{team}</span>
          <span className="match-score">{upcoming ? '—' : i === 0 ? match.score1 : match.score2}</span>
        </div>
      ))}
      {upcoming && <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', fontFamily: 'var(--font-game)' }}>ОЖИДАЕТСЯ · 14 МАЯ</span>}
    </div>
  )
}

const extraStyles = `
  .groups-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

  .group-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
  }

  .group-title {
    font-family: var(--font-game);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--text-primary);
    margin-bottom: 16px;
  }

  .group-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
  }

  .group-table th {
    text-align: left;
    padding: 8px 10px;
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
  }

  .group-table td {
    padding: 10px 10px;
    color: var(--text-secondary);
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .group-table tr:last-child td { border-bottom: none; }

  .group-table tr.qualified td { color: var(--text-primary); }
  .group-table tr.qualified .rank-cell { color: var(--gold); }
  .team-cell { font-weight: 600; color: var(--text-primary) !important; }
  .points-cell { color: var(--cyan) !important; font-weight: 700; font-family: var(--font-game); }

  .bracket-wrap {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .bracket-col { display: flex; flex-direction: column; gap: 16px; flex: 1; max-width: 320px; }
  .bracket-col-title {
    font-family: var(--font-game);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .bracket-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .match-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .match-final {
    border-color: rgba(255, 215, 0, 0.3);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
  }

  .match-team {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    transition: all var(--transition);
    background: var(--bg-secondary);
  }

  .match-winner {
    background: var(--cyan-dim);
    border: 1px solid var(--border-cyan);
  }

  .match-loser { opacity: 0.5; }

  .match-team-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-primary);
  }

  .match-score {
    font-family: var(--font-game);
    font-size: 1rem;
    font-weight: 800;
    color: var(--cyan);
  }

  @media (max-width: 640px) {
    .groups-grid { grid-template-columns: 1fr; }
    .bracket-wrap { flex-direction: column; }
    .bracket-arrow { transform: rotate(90deg); }
  }
`

const styleEl = typeof document !== 'undefined' && (() => {
  const el = document.createElement('style')
  el.textContent = extraStyles
  document.head.appendChild(el)
})()
