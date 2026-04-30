import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Gamepad2, Zap } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/disciplines', label: 'Дисциплины' },
  { to: '/teams', label: 'Команды' },
  { to: '/news', label: 'Новости' },
  { to: '/results', label: 'Результаты' },
  { to: '/faq', label: 'FAQ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  return (
    <>
      <motion.header
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <Gamepad2 size={22} />
            </div>
            <div className="logo-stack">
              <span className="logo-main">UNIVERSITY <span className="logo-accent">GAMING</span></span>
              <span className="logo-sub">LEAGUE · 2026</span>
            </div>
          </Link>

          <nav className="navbar-links desktop-only">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-actions desktop-only">
            <Link to="/register" className="btn btn-primary btn-sm">
              <Zap size={14} />
              Регистрация
            </Link>
          </div>

          <button className="mobile-menu-btn desktop-hide" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="mobile-nav">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    end={link.to === '/'}
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                  <Zap size={14} />
                  Регистрация команды
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0;
          transition: all 0.3s ease;
        }

        .navbar.scrolled {
          background: rgba(8, 8, 16, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--cyan), #0099cc);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          flex-shrink: 0;
        }

        .logo-stack {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .logo-main {
          font-family: var(--font-game);
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-primary);
        }

        .logo-accent {
          color: var(--cyan);
        }

        .logo-sub {
          font-family: var(--font-game);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--text-muted);
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition);
          letter-spacing: 0.02em;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-link.active {
          color: var(--cyan);
          background: var(--cyan-dim);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-sm {
          padding: 9px 20px;
          font-size: 0.75rem;
        }

        .desktop-only { display: flex; }
        .desktop-hide { display: none; }

        .mobile-menu-btn {
          color: var(--text-primary);
          padding: 8px;
          border-radius: var(--radius-sm);
          background: var(--bg-card);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
        }

        .mobile-menu {
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          background: rgba(8, 8, 16, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-cyan);
          z-index: 999;
          padding: 16px 0;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 16px;
        }

        .mobile-nav-link {
          display: block;
          padding: 14px 16px;
          border-radius: var(--radius-sm);
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition);
        }

        .mobile-nav-link:hover, .mobile-nav-link.active {
          color: var(--cyan);
          background: var(--cyan-dim);
        }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .desktop-hide { display: flex !important; }
        }
      `}</style>
    </>
  )
}
