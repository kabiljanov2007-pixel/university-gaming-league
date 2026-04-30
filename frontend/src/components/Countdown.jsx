import { useState, useEffect, Fragment } from 'react'
import { motion } from 'framer-motion'

const TOURNAMENT_DATE = new Date('2026-05-15T09:00:00')

function pad(n) { return String(n).padStart(2, '0') }

export default function Countdown() {
  const [time, setTime] = useState(calcTime())

  function calcTime() {
    const diff = TOURNAMENT_DATE - new Date()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      over: false,
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setTime(calcTime()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (time.over) return (
    <div className="countdown-over">
      <span className="countdown-over-text">ТУРНИР НАЧАЛСЯ!</span>
    </div>
  )

  const units = [
    { value: time.days, label: 'Дней' },
    { value: time.hours, label: 'Часов' },
    { value: time.minutes, label: 'Минут' },
    { value: time.seconds, label: 'Секунд' },
  ]

  return (
    <div className="countdown">
      {units.map((unit, i) => (
        <Fragment key={unit.label}>
          <div className="countdown-unit">
            <motion.span
              key={unit.value}
              className="countdown-value"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {pad(unit.value)}
            </motion.span>
            <span className="countdown-label">{unit.label}</span>
          </div>
          {i < 3 && <span className="countdown-sep">:</span>}
        </Fragment>
      ))}

      <style>{`
        .countdown {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 212, 255, 0.05);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 12px;
          padding: 16px 20px;
          min-width: 80px;
        }

        .countdown-value {
          font-family: var(--font-game);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--cyan);
          line-height: 1;
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
          letter-spacing: 0.05em;
        }

        .countdown-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 6px;
        }

        .countdown-sep {
          font-family: var(--font-game);
          font-size: 2rem;
          font-weight: 800;
          color: var(--cyan);
          opacity: 0.5;
          margin-bottom: 20px;
          animation: pulse-glow 1s ease-in-out infinite;
          line-height: 1;
        }

        .countdown-over {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .countdown-over-text {
          font-family: var(--font-game);
          font-size: 1.5rem;
          color: var(--cyan);
          animation: flicker 2s linear infinite;
        }

        @media (max-width: 500px) {
          .countdown-unit { min-width: 60px; padding: 12px 14px; }
          .countdown-value { font-size: 1.6rem; }
          .countdown-sep { font-size: 1.6rem; }
        }
      `}</style>
    </div>
  )
}
