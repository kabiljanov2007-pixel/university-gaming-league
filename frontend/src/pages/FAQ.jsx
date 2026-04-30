import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HelpCircle, ChevronDown, Zap, MessageCircle } from 'lucide-react'

const faqs = [
  {
    category: 'Регистрация',
    questions: [
      {
        q: 'Кто может принять участие в турнире?',
        a: 'Участвовать могут студенты любого университета Кыргызстана. Необходимо предоставить действующий студенческий билет. Аспиранты и магистранты также допускаются.',
      },
      {
        q: 'Как зарегистрировать команду?',
        a: 'Заполни форму регистрации на странице «Регистрация». Укажи дисциплину, данные команды и каждого игрока. После отправки заявки организаторы свяжутся с капитаном для подтверждения.',
      },
      {
        q: 'Сколько человек в команде?',
        a: 'Основной состав — 4 игрока. Каждый игрок должен играть только за одну команду в одной дисциплине.',
      },
      {
        q: 'Можно ли участвовать в обеих дисциплинах?',
        a: 'Да, одна команда может участвовать в обеих дисциплинах, но составы должны быть разными. Один игрок не может играть за две команды.',
      },
      {
        q: 'До какого числа принимаются заявки?',
        a: 'Регистрация открыта с 1 по 12 мая 2026 года включительно. Заявки, поданные после 23:59 12 мая, не рассматриваются.',
      },
    ],
  },
  {
    category: 'Турнир',
    questions: [
      {
        q: 'Где проводится турнир?',
        a: 'Турнир проходит офлайн в кампусе Университета им. К.Ш. Токтоматова по адресу: ул. Тарсус, 1а, Бишкек. Вход для зрителей свободный.',
      },
      {
        q: 'Какой формат турнира?',
        a: 'Групповой этап → Полуфинал → Финал. Точный формат определения победителей пока уточняется.',
      },
      {
        q: 'Нужно ли приносить собственное устройство?',
        a: 'Да, каждый участник должен иметь собственный смартфон или планшет с установленной игрой. Организаторы предоставят Wi-Fi. Использование стороннего интернета на матчах запрещено.',
      },
      {
        q: 'Что будет в случае технических проблем во время матча?',
        a: 'При технической неполадке (разрыв связи, зависание) игрок должен немедленно сообщить судье. Решение о переигровке матча принимается индивидуально в каждом случае.',
      },
      {
        q: 'Когда проводится турнир?',
        a: 'Турнир состоится 15 мая 2026 года. Подготовка — дата уточняется. Регистрация команд открыта с 1 по 12 мая 2026.',
      },
    ],
  },
  {
    category: 'Призы',
    questions: [
      {
        q: 'Какие призы ждут победителей?',
        a: 'Победители получают кубки и медали. Также партнёры турнира предоставят специальные призы: гаджеты, гейминговые аксессуары и другие ценные подарки. Подробности будут объявлены позже.',
      },
      {
        q: 'Когда и где пройдёт церемония награждения?',
        a: 'Церемония награждения состоится 15 мая 2026 года сразу после финальных матчей, в кампусе университета им. К.Ш. Токтоматова по адресу ул. Тарсус, 1а, Манас.',
      },
    ],
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-cyan" style={{ marginBottom: '16px' }}>
              <HelpCircle size={12} />
              FAQ
            </span>
            <h1 className="section-title">
              Вопросы и <span className="gradient-cyan">ответы</span>
            </h1>
            <p className="section-subtitle">
              Не нашёл ответа? Напиши нам в Telegram или на почту.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq-layout">
            <div className="faq-content">
              {faqs.map((cat, ci) => (
                <motion.div
                  key={ci}
                  className="faq-category"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ci * 0.1 }}
                >
                  <h2 className="faq-cat-title">{cat.category}</h2>
                  <div className="faq-list">
                    {cat.questions.map((item, qi) => {
                      const key = `${ci}-${qi}`
                      const isOpen = open === key
                      return (
                        <div key={qi} className={`faq-item ${isOpen ? 'faq-open' : ''}`}>
                          <button
                            className="faq-question"
                            onClick={() => setOpen(isOpen ? null : key)}
                          >
                            <span>{item.q}</span>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={18} className="faq-arrow" />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                className="faq-answer"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                              >
                                <p>{item.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="faq-sidebar">
              <div className="faq-contact-card">
                <MessageCircle size={32} style={{ color: 'var(--cyan)', marginBottom: 16 }} />
                <h3 style={{ fontFamily: 'var(--font-game)', fontSize: '0.9rem', marginBottom: 10 }}>Нужна помощь?</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                  Если у тебя остались вопросы — свяжись с нами!
                </p>
                <a href="https://t.me/kabilzhanovv" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}>
                  Telegram @kabilzhanovv
                </a>
                <a href="https://wa.me/996755041207" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}>
                  WhatsApp +996 755 041 207
                </a>
                <a href="mailto:universitygamingleaguemnu@gmail.com" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}>
                  universitygamingleaguemnu@gmail.com
                </a>
              </div>

              <div className="faq-register-card">
                <Zap size={28} style={{ color: 'var(--gold)', marginBottom: 12 }} />
                <h3 style={{ fontFamily: 'var(--font-game)', fontSize: '0.9rem', marginBottom: 10 }}>
                  Готов играть?
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                  Регистрация команд открыта с 1 по 12 мая 2026!
                </p>
                <Link to="/register" className="btn btn-purple" style={{ width: '100%', justifyContent: 'center' }}>
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .faq-layout {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 40px;
          align-items: start;
        }

        .faq-category { margin-bottom: 40px; }

        .faq-cat-title {
          font-family: var(--font-game);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--cyan);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .faq-cat-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .faq-list { display: flex; flex-direction: column; gap: 8px; }

        .faq-item {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          transition: border-color var(--transition);
        }

        .faq-item.faq-open {
          border-color: var(--border-cyan);
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 20px;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          background: none;
          border: none;
          gap: 16px;
          cursor: pointer;
          transition: color var(--transition);
        }

        .faq-question:hover { color: var(--cyan); }

        .faq-arrow { color: var(--text-muted); flex-shrink: 0; }
        .faq-open .faq-arrow { color: var(--cyan); }

        .faq-answer {
          overflow: hidden;
        }

        .faq-answer p {
          padding: 0 20px 20px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.7;
          border-top: 1px solid var(--border);
          padding-top: 16px;
        }

        .faq-sidebar {
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-contact-card, .faq-register-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .faq-register-card {
          border-color: var(--border-purple);
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, var(--bg-card) 100%);
        }

        @media (max-width: 768px) {
          .faq-layout { grid-template-columns: 1fr; }
          .faq-sidebar { position: static; }
        }
      `}</style>
    </>
  )
}
