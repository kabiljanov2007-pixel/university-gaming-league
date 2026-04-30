import { Link } from 'react-router-dom'
import { Gamepad2, MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="neon-divider" />
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <Gamepad2 size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontFamily: 'var(--font-game)', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                  UNIVERSITY <span style={{ color: 'var(--cyan)' }}>GAMING</span>
                </span>
                <span style={{ fontFamily: 'var(--font-game)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-muted)' }}>
                  LEAGUE · 2026
                </span>
              </div>
            </Link>
            <p className="footer-desc">
              Первый университетский турнир по мобильному киберспорту в Кыргызстане. Покажи на что ты способен!
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Навигация</h4>
            <ul className="footer-links">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/disciplines">Дисциплины</Link></li>
              <li><Link to="/register">Регистрация</Link></li>
              <li><Link to="/teams">Команды</Link></li>
              <li><Link to="/news">Новости</Link></li>
              <li><Link to="/results">Результаты</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Дисциплины</h4>
            <ul className="footer-links">
              <li><Link to="/disciplines#pubg">PUBG Mobile</Link></li>
              <li><Link to="/disciplines#freefire">Free Fire</Link></li>
            </ul>

            <h4 className="footer-heading" style={{ marginTop: '24px' }}>Важные даты</h4>
            <ul className="footer-dates">
              <li>
                <span className="date-badge">01–12 МАЯ</span>
                <span>Регистрация команд</span>
              </li>
              <li>
                <span className="date-badge">15 МАЯ</span>
                <span>День турнира</span>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Контакты</h4>
            <ul className="footer-contacts">
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>мкр. Спутник, ул. Тарсус, 1а, Манас, Кыргызстан</span>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <a href="mailto:universitygamingleaguemnu@gmail.com">universitygamingleaguemnu@gmail.com</a>
              </li>
              <li>
                <Phone size={16} className="contact-icon" />
                <a href="tel:+996755041207">+996 755 041 207</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} University Gaming League 2026. Все права защищены.</p>
          <p className="footer-uni">Университет им. К.Ш. Токтоматова</p>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--bg-secondary);
          padding: 64px 0 0;
          margin-top: auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 48px;
          padding: 48px 0;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          margin-bottom: 16px;
        }

        .footer-logo .logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, var(--cyan), #0099cc);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          flex-shrink: 0;
        }

        .footer-logo .logo-text {
          font-family: var(--font-game);
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--text-primary);
        }

        .footer-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .social-links {
          display: flex;
          gap: 10px;
        }

        .social-btn {
          width: 38px;
          height: 38px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all var(--transition);
        }

        .social-btn:hover {
          border-color: var(--border-cyan);
          color: var(--cyan);
          background: var(--cyan-dim);
        }

        .footer-heading {
          font-family: var(--font-game);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--cyan);
          margin-bottom: 16px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links a {
          color: var(--text-secondary);
          font-size: 0.9rem;
          transition: color var(--transition);
        }

        .footer-links a:hover {
          color: var(--cyan);
        }

        .footer-dates {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-dates li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .date-badge {
          font-family: var(--font-game);
          font-size: 0.65rem;
          padding: 3px 8px;
          background: var(--cyan-dim);
          color: var(--cyan);
          border: 1px solid var(--border-cyan);
          border-radius: 4px;
          white-space: nowrap;
        }

        .footer-contacts {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-contacts li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .contact-icon {
          color: var(--cyan);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .footer-contacts a {
          color: var(--text-secondary);
          transition: color var(--transition);
        }

        .footer-contacts a:hover { color: var(--cyan); }

        .footer-bottom {
          border-top: 1px solid var(--border);
          padding: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .footer-uni {
          font-family: var(--font-game);
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
          .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
        }
      `}</style>
    </footer>
  )
}
