import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trophy, Users, Target, Clock, Zap, Shield, ChevronRight } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

const disciplines = [
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    fullName: 'PlayerUnknown\'s Battlegrounds Mobile',
    emoji: '🎯',
    color: 'cyan',
    posterLabel: 'Эрангель · PUBG Mobile',
    prize: 'TBD',
    prizeBreakdown: [
      { place: '1 место', amount: '🥇 Кубок + Медаль', color: 'gold' },
      { place: '2 место', amount: '🥈 Медаль', color: 'silver' },
      { place: '3 место', amount: '🥉 Медаль', color: 'bronze' },
    ],
    teamSize: 4,
    format: 'Squads (4 человека)',
    rounds: 'Пока неизвестно',
    duration: 'Пока неизвестно',
    rules: [
      'Команды состоят из 4 игроков',
      'Все игроки используют личные аккаунты',
      'Запрещён буст и использование читов',
      'Устройства должны быть одобрены организаторами',
    ],
    requirements: [
      'Аккаунт уровня не ниже 30',
      'Студент университета Кыргызстана',
      'Наличие смартфона или планшета',
      'Согласие с правилами турнира',
    ],
    desc: 'Самый популярный мобильный Battle Royale. 64 команды, 1 выживший победитель. Тактика, координация и точность стрельбы — вот что определяет чемпиона. PUBG Mobile — это про командную работу и стратегическое мышление.',
  },
  {
    id: 'freefire',
    name: 'Free Fire',
    fullName: 'Garena Free Fire MAX',
    emoji: '🔥',
    color: 'purple',
    posterLabel: 'Бермуды · Free Fire',
    prize: 'TBD',
    prizeBreakdown: [
      { place: '1 место', amount: '🥇 Кубок + Медаль', color: 'gold' },
      { place: '2 место', amount: '🥈 Медаль', color: 'silver' },
      { place: '3 место', amount: '🥉 Медаль', color: 'bronze' },
    ],
    teamSize: 4,
    format: 'Squads (4 человека)',
    rounds: 'Пока неизвестно',
    duration: 'Пока неизвестно',
    rules: [
      'Команды состоят из 4 игроков',
      'Персонажи и питомцы — по выбору',
      'Все игроки используют личные аккаунты',
      'Запрещены модифицированные APK файлы',
    ],
    requirements: [
      'Аккаунт уровня не ниже 20',
      'Студент университета Кыргызстана',
      'Наличие смартфона или планшета',
      'Согласие с правилами турнира',
    ],
    desc: 'Динамичный Fast-Paced Battle Royale с уникальными персонажами и способностями. Быстрые матчи, яркие эффекты и высокая скорость геймплея. Каждый матч длится 10 минут — нет времени на раздумья, только действие!',
  },
]

export default function Disciplines() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <motion.div
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge badge-cyan" style={{ marginBottom: '16px' }}>
              <Target size={12} />
              Дисциплины
            </span>
            <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Выбери свою <span className="gradient-cyan">дисциплину</span>
            </h1>
            <p className="section-subtitle">
              Два топовых мобильных Battle Royale. Выбери игру, собери команду и побори за призы!
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container" style={{ padding: '60px 24px' }}>
        {disciplines.map((d, idx) => (
          <motion.div
            key={d.id}
            id={d.id}
            className={`discipline-detail ${idx > 0 ? 'discipline-mt' : ''}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className={`discipline-hero-card disc-${d.color}`} variants={fadeUp}>
              <div className="disc-hero-left">
                <span className="disc-emoji">{d.emoji}</span>
                <div>
                  <span className={`badge badge-${d.color}`} style={{ marginBottom: '10px' }}>
                    Battle Royale
                  </span>
                  <h2 className="disc-name">{d.name}</h2>
                  <p className="disc-fullname">{d.fullName}</p>
                  <p className="disc-desc">{d.desc}</p>
                </div>
              </div>
              <div className={`disc-hero-media disc-hero-media-${d.id}`} aria-hidden="true">
                <div className="disc-hero-media-label">{d.posterLabel}</div>
              </div>
              <div className="disc-hero-right">
                <div className={`prize-box prize-${d.color}`}>
                  <Trophy size={28} className="prize-icon" />
                  <div className="prize-label">Призы</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
                    Медали · Кубки<br />Призы от партнёров
                  </div>
                  <div className="prize-breakdown">
                    {d.prizeBreakdown.map((p, i) => (
                      <div key={i} className={`prize-row prize-row-${p.color}`}>
                        <span>{p.place}</span>
                        <span>{p.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="disc-details-grid">
              <motion.div className="disc-info-card" variants={fadeUp}>
                <h3 className="disc-card-title">
                  <Zap size={18} />
                  Формат турнира
                </h3>
                <ul className="disc-info-list">
                  <li>
                    <span className="info-label">Состав команды</span>
                    <span className="info-value">{d.format}</span>
                  </li>
                  <li>
                    <span className="info-label">Туры</span>
                    <span className="info-value">{d.rounds}</span>
                  </li>
                  <li>
                    <span className="info-label">Продолжительность</span>
                    <span className="info-value">{d.duration}</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div className="disc-info-card" variants={fadeUp}>
                <h3 className="disc-card-title">
                  <Shield size={18} />
                  Правила
                </h3>
                <ul className="disc-rules-list">
                  {d.rules.map((r, i) => (
                    <li key={i}>
                      <span className="rule-dot" />
                      {r}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div className="disc-info-card" variants={fadeUp}>
                <h3 className="disc-card-title">
                  <Users size={18} />
                  Требования
                </h3>
                <ul className="disc-rules-list">
                  {d.requirements.map((r, i) => (
                    <li key={i}>
                      <span className="rule-dot req-dot" />
                      {r}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`btn btn-${d.color === 'cyan' ? 'primary' : 'purple'}`} style={{ marginTop: '24px', justifyContent: 'center' }}>
                  <Zap size={14} />
                  Зарегистрироваться
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .discipline-mt { margin-top: 80px; }

        .discipline-hero-card {
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          padding: 32px;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(280px, 360px) 220px;
          gap: 28px;
          align-items: stretch;
          margin-bottom: 24px;
          transition: all var(--transition);
        }

        .disc-cyan {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.04) 0%, var(--bg-card) 100%);
          border-color: var(--border-cyan);
        }

        .disc-purple {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.04) 0%, var(--bg-card) 100%);
          border-color: var(--border-purple);
        }

        .discipline-hero-card { position: relative; overflow: hidden; }

        .disc-hero-left {
          display: flex;
          gap: 28px;
          align-items: flex-start;
          position: relative;
          z-index: 1;
          padding-right: 6px;
        }

        .disc-hero-media {
          position: relative;
          min-height: 320px;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 20px 50px rgba(0,0,0,0.35);
          background-size: cover;
          background-repeat: no-repeat;
        }

        .disc-hero-media::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(4, 8, 18, 0.18) 0%, rgba(4, 8, 18, 0.58) 100%),
            radial-gradient(circle at 15% 20%, rgba(255,255,255,0.12), transparent 35%);
        }

        .disc-hero-media::after {
          content: '';
          position: absolute;
          inset: 12px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          pointer-events: none;
        }

        .disc-hero-media-pubg {
          background-image:
            linear-gradient(135deg, rgba(0, 212, 255, 0.22), rgba(0, 8, 20, 0.18)),
            url('/images/pubg-poster.jpg');
          background-position: center center;
        }

        .disc-hero-media-freefire {
          background-image:
            linear-gradient(135deg, rgba(124, 58, 237, 0.22), rgba(18, 0, 32, 0.18)),
            url('/images/ff-poster.jpg');
          background-position: center center;
        }

        .disc-hero-media-label {
          position: absolute;
          left: 18px;
          bottom: 18px;
          z-index: 1;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(6, 10, 18, 0.72);
          backdrop-filter: blur(10px);
          font-family: var(--font-game);
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .disc-emoji {
          font-size: 4rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .disc-name {
          font-family: var(--font-game);
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: 0.03em;
          margin-bottom: 4px;
        }

        .disc-fullname {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .disc-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.7;
          max-width: 100%;
        }

        .disc-hero-right {
          position: relative;
          z-index: 1;
          display: flex;
        }

        .prize-box {
          border-radius: var(--radius);
          padding: 28px;
          text-align: center;
          width: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .prize-cyan {
          background: var(--cyan-dim);
          border: 1px solid var(--border-cyan);
        }

        .prize-purple {
          background: var(--purple-dim);
          border: 1px solid var(--border-purple);
        }

        .prize-icon {
          color: var(--gold);
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4));
        }

        .prize-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          font-family: var(--font-game);
        }

        .prize-amount {
          font-family: var(--font-game);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--gold);
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
        }

        .prize-breakdown {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .prize-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          padding: 6px 10px;
          border-radius: 6px;
          font-weight: 600;
        }

        .prize-row-gold { background: rgba(255, 215, 0, 0.1); color: var(--gold); }
        .prize-row-silver { background: rgba(192, 192, 192, 0.1); color: #c0c0c0; }
        .prize-row-bronze { background: rgba(205, 127, 50, 0.1); color: #cd7f32; }

        .disc-details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .disc-info-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 28px;
        }

        .disc-card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-game);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--cyan);
          margin-bottom: 20px;
        }

        .disc-info-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .disc-info-list li {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .info-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .disc-rules-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .disc-rules-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .rule-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--cyan);
          flex-shrink: 0;
          margin-top: 7px;
        }

        .req-dot { background: #a78bfa; }

        @media (max-width: 1180px) {
          .disc-details-grid { grid-template-columns: 1fr; }
          .discipline-hero-card { grid-template-columns: 1fr; }
          .disc-hero-right { width: 100%; }
          .prize-box { width: 100%; }
          .disc-hero-media { min-height: 260px; }
        }

        @media (max-width: 640px) {
          .disc-hero-left { flex-direction: column; }
          .discipline-hero-card { padding: 24px; }
          .disc-hero-media { min-height: 220px; }
        }
      `}</style>
    </>
  )
}
