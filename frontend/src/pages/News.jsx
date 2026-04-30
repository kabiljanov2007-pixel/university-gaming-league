import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Newspaper, ChevronRight, Calendar, Tag, Search } from 'lucide-react'
import api from '../hooks/useApi'

const tagColors = { 'Анонс': 'cyan', 'Официально': 'purple', 'Организация': 'purple', 'Партнёры': 'cyan' }

const fmt = (iso) => new Date(iso).toLocaleDateString('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric',
})

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('all')

  useEffect(() => {
    api.get('/news')
      .then(res => { setNews(res.data.items || []); setError(null) })
      .catch(err => setError(err.response?.data?.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [])

  const tags = ['all', ...new Set(news.map(n => n.tag))]

  const filtered = news.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase())
    const matchTag = activeTag === 'all' || n.tag === activeTag
    return matchSearch && matchTag
  })

  const featured = filtered[0] || null
  const rest = filtered.slice(1)

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-purple" style={{ marginBottom: '16px' }}>
              <Newspaper size={12} />
              Новости
            </span>
            <h1 className="section-title">
              Все <span className="gradient-purple">новости</span>
            </h1>
            <p className="section-subtitle">Следи за последними новостями University Gaming League 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="news-controls">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                className="form-input search-input"
                placeholder="Поиск новостей..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              {tags.map(t => (
                <button
                  key={t}
                  className={`filter-tab ${activeTag === t ? 'active' : ''}`}
                  onClick={() => setActiveTag(t)}
                >
                  {t === 'all' ? 'Все' : t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="loading-spinner" />
              <p>Загрузка новостей...</p>
            </div>
          ) : error ? (
            <div className="empty-state"><Newspaper size={48} /><p>{error}</p></div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              {featured && (
                <motion.div variants={fadeUp} style={{ marginBottom: 32 }}>
                  <Link to={`/news/${featured.id}`} className="news-featured-card">
                    <div className="featured-badge-wrap">
                      <span className="badge badge-gold">
                        <Tag size={10} /> Главное
                      </span>
                    </div>
                    <span className={`badge badge-${tagColors[featured.tag] || 'cyan'}`}>{featured.tag}</span>
                    <h2 className="featured-title">{featured.title}</h2>
                    <p className="featured-excerpt">{featured.excerpt}</p>
                    <div className="featured-footer">
                      <span className="news-date"><Calendar size={14} /> {fmt(featured.created_at)}</span>
                      <span className="news-read-more">Читать полностью <ChevronRight size={16} /></span>
                    </div>
                  </Link>
                </motion.div>
              )}

              <div className="news-grid">
                {rest.map(n => (
                  <motion.div key={n.id} variants={fadeUp}>
                    <Link to={`/news/${n.id}`} className="news-card-full">
                      <div className="news-card-body">
                        <span className={`badge badge-${tagColors[n.tag] || 'cyan'}`}>{n.tag}</span>
                        <h3 className="news-card-title">{n.title}</h3>
                        <p className="news-card-excerpt">{n.excerpt}</p>
                      </div>
                      <div className="news-card-footer">
                        <span className="news-date"><Calendar size={13} /> {fmt(n.created_at)}</span>
                        <span className="news-read-link">Читать <ChevronRight size={14} /></span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="empty-state">
                  <Newspaper size={48} />
                  <p>Новостей не найдено</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <style>{`
        .news-controls {
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

        .news-featured-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 36px;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.04) 0%, var(--bg-card) 100%);
          border: 1px solid var(--border-cyan);
          border-radius: var(--radius-lg);
          text-decoration: none;
          color: inherit;
          transition: all var(--transition);
          position: relative;
        }

        .news-featured-card:hover {
          box-shadow: var(--glow-cyan);
          transform: translateY(-3px);
        }

        .featured-badge-wrap {
          position: absolute;
          top: -12px;
          left: 24px;
        }

        .featured-title {
          font-family: var(--font-game);
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          font-weight: 800;
          letter-spacing: 0.03em;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .featured-excerpt {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.7;
          max-width: 700px;
        }

        .featured-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .news-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .news-read-more {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          color: var(--cyan);
          font-weight: 600;
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .news-card-full {
          display: flex;
          flex-direction: column;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all var(--transition);
          height: 100%;
        }

        .news-card-full:hover {
          border-color: var(--border-purple);
          box-shadow: var(--glow-purple);
          transform: translateY(-3px);
        }

        .news-card-body {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .news-card-title {
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.4;
          color: var(--text-primary);
        }

        .news-card-excerpt {
          font-size: 0.87rem;
          color: var(--text-secondary);
          line-height: 1.6;
          flex: 1;
        }

        .news-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 24px;
          border-top: 1px solid var(--border);
          background: var(--bg-secondary);
        }

        .news-read-link {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.8rem;
          color: #a78bfa;
          font-weight: 600;
        }

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
          .news-grid { grid-template-columns: 1fr; }
          .news-featured-card { padding: 24px; }
          .news-controls { flex-direction: column; }
        }
      `}</style>
    </>
  )
}
