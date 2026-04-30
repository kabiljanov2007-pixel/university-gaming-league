import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Calendar, Tag, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../hooks/useApi'

const fmt = (iso) => new Date(iso).toLocaleDateString('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric',
})

const renderContent = (text) => {
  return text.trim().split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} style={{ fontFamily: 'var(--font-game)', fontSize: '1.2rem', color: 'var(--cyan)', margin: '28px 0 12px', letterSpacing: '0.05em' }}>{line.replace('## ', '')}</h2>
    if (line.match(/^\d+\./)) return <li key={i} style={{ marginLeft: 20, marginBottom: 6, color: 'var(--text-secondary)' }}>{line.replace(/^\d+\./, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
    if (line.startsWith('- **')) {
      const parts = line.replace('- **', '').split('**')
      return <li key={i} style={{ marginLeft: 20, marginBottom: 6, color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--text-primary)' }}>{parts[0]}</strong>{parts[1]}</li>
    }
    if (line.trim() === '') return <br key={i} />
    const bold = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong style="color:var(--text-primary)">${m}</strong>`)
    return <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: bold }} />
  })
}

export default function NewsDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    api.get(`/news/${id}`)
      .then(res => setArticle(res.data))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Ссылка скопирована!')
  }

  if (loading) return (
    <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--cyan)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (notFound || !article) return (
    <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-game)', color: 'var(--text-muted)' }}>Статья не найдена</h2>
      <Link to="/news" className="btn btn-secondary" style={{ marginTop: 24 }}>
        <ChevronLeft size={16} /> Назад к новостям
      </Link>
    </div>
  )

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/news" className="btn btn-secondary" style={{ marginBottom: 24 }}>
              <ChevronLeft size={16} /> Все новости
            </Link>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <span className="badge badge-cyan"><Tag size={10} /> {article.tag}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Calendar size={13} /> {fmt(article.created_at)}
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-game)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, lineHeight: 1.3, maxWidth: 800, marginBottom: 24 }}>
              {article.title}
            </h1>
            <button onClick={handleShare} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
              <Share2 size={14} /> Поделиться
            </button>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ maxWidth: 760, margin: '0 auto' }}
          >
            <article className="article-body">
              {renderContent(article.content)}
            </article>

            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
              <Link to="/news" className="btn btn-secondary">
                <ChevronLeft size={16} /> Все новости
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .article-body {
          font-size: 1rem;
          line-height: 1.8;
        }

        .article-body ol, .article-body ul {
          margin-bottom: 16px;
        }
      `}</style>
    </>
  )
}
