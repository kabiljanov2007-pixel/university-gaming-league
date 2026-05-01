import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, Trophy, Users, Calendar, MapPin,
  ChevronRight, Gamepad2, Target, Clock, Star
} from 'lucide-react'
import Countdown from '../components/Countdown'
import api from '../hooks/useApi'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

const fmt = (iso) => new Date(iso).toLocaleDateString('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric',
})

export default function Home() {
  return (
    <>
      <HeroSection />
      <DisciplinesSection />
      <TimelineSection />
      <AboutSection />
      <NewsPreview />
      <CTASection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="hero-v2">
      {/* Circuit background */}
      <div className="hero-circuit-bg">
        <div className="hero-character-backdrop hero-character-backdrop-left" />
        <div className="hero-character-backdrop hero-character-backdrop-right" />
        <div className="hero-backdrop-vignette" />
        <div className="circuit-grid" />
        <div className="circuit-trace-h circuit-trace-h1" />
        <div className="circuit-trace-h circuit-trace-h2" />
        <div className="circuit-trace-v circuit-trace-v1" />
        <div className="circuit-trace-v circuit-trace-v2" />
        <div className="circuit-orb circuit-orb-l" />
        <div className="circuit-orb circuit-orb-r" />
        <div className="circuit-orb circuit-orb-c" />
      </div>

      {/* University header */}
      <motion.div
        className="uni-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <img src="/images/logo-mnu.png" alt="МНУ" className="uni-logo-img" />
        <div className="uni-text">
          <strong>УНИВЕРСИТЕТ ИМЕНИ К.Ш. ТОКТОМАТОВА</strong>
          <span>приглашает принять участие в студенческом киберспортивном турнире</span>
        </div>
        <img src="/images/logo-itu.png" alt="ИТУ" className="uni-logo-img" />
      </motion.div>

      {/* 3-column hero */}
      <div className="hero-three-col">

        {/* Left — PUBG */}
        <motion.div
          className="game-panel game-panel-pubg"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <div className="char-art">
            <div className="char-glow char-glow-pubg" />
            <div className="char-photo char-photo-pubg" aria-hidden="true" />
            <div className="panel-scanline" />
            <div className="panel-corner tl" /><div className="panel-corner tr" />
            <div className="panel-corner bl" /><div className="panel-corner br" />
          </div>
          <div className="game-panel-footer">
            <div className="game-map-label">КАРТА: ЭРАНГЕЛЬ</div>
            <div className="game-logo-block pubg-block">
              <span className="game-name-big">PUBG</span>
              <span className="game-name-sub">MOBILE</span>
            </div>
            <div className="game-type-label">BATTLE ROYALE · 4v4</div>
          </div>
        </motion.div>

        {/* Center */}
        <motion.div
          className="hero-center-col"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <span className="badge badge-gold hero-top-badge">
              <Zap size={12} /> 15 МАЯ 2026 · МАНАС
            </span>
          </motion.div>

          <motion.div className="hero-title-shell" variants={fadeUp}>
            <div className="hero-title-frame">
              <h1 className="hero-title-v2">
                UNIVERSITY
                <br />
                <span className="title-gaming">GAMING</span>
                <br />
                LEAGUE
                <br />
                <span className="title-year">2026</span>
              </h1>
              <div className="hero-trophy-row">
                <Trophy size={52} className="hero-trophy-ico" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="hero-cta-row">
            <Link to="/register" className="btn btn-primary hero-btn-lg btn-pulse">
              <Zap size={16} /> Регистрация
            </Link>
            <Link to="/disciplines" className="btn btn-secondary">
              Подробнее <ChevronRight size={16} />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="hero-cd-wrap">
            <p className="cd-label">До начала турнира</p>
            <Countdown />
          </motion.div>
        </motion.div>

        {/* Right — Free Fire */}
        <motion.div
          className="game-panel game-panel-ff"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <div className="char-art">
            <div className="char-glow char-glow-ff" />
            <div className="char-photo char-photo-ff" aria-hidden="true" />
            <div className="panel-scanline" />
            <div className="panel-corner tl" /><div className="panel-corner tr" />
            <div className="panel-corner bl" /><div className="panel-corner br" />
          </div>
          <div className="game-panel-footer">
            <div className="game-map-label">КАРТА: БЕРМУДЫ</div>
            <div className="game-logo-block ff-block">
              <span className="game-name-big">FREE</span>
              <span className="game-name-sub">FIRE</span>
            </div>
            <div className="game-type-label">BATTLE ROYALE · 4v4</div>
          </div>
        </motion.div>

      </div>

      {/* Info boxes */}
      <motion.div
        className="hero-info-row"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="info-box info-cyan">
          <Calendar size={22} className="ib-icon" />
          <div>
            <span className="ib-label">ТУРНИР СОСТОИТСЯ</span>
            <strong className="ib-value">15 МАЯ 2026 ГОДА</strong>
          </div>
        </div>
        <div className="info-box info-purple">
          <MapPin size={22} className="ib-icon" />
          <div>
            <span className="ib-label">МЕСТО ПРОВЕДЕНИЯ</span>
            <strong className="ib-value">УЛ. ТАРСУС, 1А · МАНАС</strong>
          </div>
        </div>
        <div className="info-box info-cyan">
          <Clock size={22} className="ib-icon" />
          <div>
            <span className="ib-label">ПРИЁМ ЗАЯВОК</span>
            <strong className="ib-value">1 МАЯ — 12 МАЯ 2026</strong>
          </div>
        </div>
      </motion.div>

      {/* Award banner */}
      <motion.div
        className="award-banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Trophy size={18} />
        ПОБЕДИТЕЛИ БУДУТ НАГРАЖДЕНЫ ДИПЛОМАМИ, МЕДАЛЯМИ И КУБКАМИ
        <Trophy size={18} />
      </motion.div>

      <style>{`
        /* ─── Hero V2 ──────────────────────────────────────── */
        .hero-v2 {
          position: relative;
          min-height: 100vh;
          background: #050510;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 80px;
        }

        /* Circuit background */
        .hero-circuit-bg { position: absolute; inset: 0; pointer-events: none; }

        .hero-character-backdrop {
          position: absolute;
          top: 0;
          bottom: 0;
          width: min(34vw, 420px);
          background-size: cover;
          background-repeat: no-repeat;
          opacity: 0.34;
          filter: saturate(1.15) contrast(1.08);
          z-index: 0;
        }

        .hero-character-backdrop::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(5, 5, 8, 0.18) 0%, rgba(5, 5, 8, 0.78) 100%),
            linear-gradient(90deg, rgba(5, 5, 8, 0.12) 0%, rgba(5, 5, 8, 0.62) 100%);
        }

        .hero-character-backdrop-left {
          left: 0;
          background-image:
            linear-gradient(135deg, rgba(0, 255, 255, 0.18), rgba(7, 14, 30, 0.2)),
            url('/images/pubg-poster.jpg');
          background-position: left center;
          box-shadow: inset -80px 0 120px rgba(5, 5, 8, 0.95);
        }

        .hero-character-backdrop-right {
          right: 0;
          background-image:
            linear-gradient(135deg, rgba(255, 0, 255, 0.2), rgba(7, 14, 30, 0.24)),
            url('/images/ff-poster.jpg');
          background-position: right center;
          box-shadow: inset 80px 0 120px rgba(5, 5, 8, 0.95);
        }

        .hero-backdrop-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at center, transparent 0%, rgba(5, 5, 8, 0.08) 44%, rgba(5, 5, 8, 0.74) 100%),
            linear-gradient(90deg, rgba(5, 5, 8, 0.82) 0%, transparent 24%, transparent 76%, rgba(5, 5, 8, 0.82) 100%);
          z-index: 0;
        }

        .circuit-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0, 212, 255, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.035) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .circuit-trace-h, .circuit-trace-v {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(0,212,255,0.12), transparent);
        }
        .circuit-trace-h { height: 1px; width: 80%; left: 10%; }
        .circuit-trace-h1 { top: 35%; }
        .circuit-trace-h2 { top: 70%; background: linear-gradient(90deg, transparent, rgba(124,58,237,0.1), transparent); }
        .circuit-trace-v { width: 1px; height: 60%; top: 20%; background: linear-gradient(180deg, transparent, rgba(0,212,255,0.1), transparent); }
        .circuit-trace-v1 { left: 20%; }
        .circuit-trace-v2 { right: 20%; background: linear-gradient(180deg, transparent, rgba(124,58,237,0.1), transparent); }

        .circuit-orb { position: absolute; border-radius: 50%; filter: blur(60px); }
        .circuit-orb-l { width: 600px; height: 600px; background: radial-gradient(circle, rgba(0,80,200,0.22) 0%, transparent 70%); top: -150px; left: -150px; }
        .circuit-orb-r { width: 500px; height: 500px; background: radial-gradient(circle, rgba(100,0,200,0.22) 0%, transparent 70%); top: -100px; right: -120px; }
        .circuit-orb-c { width: 400px; height: 200px; background: radial-gradient(ellipse, rgba(0,212,255,0.07) 0%, transparent 70%); top: 45%; left: 50%; transform: translateX(-50%); filter: blur(30px); }

        /* University header */
        .uni-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 14px 20px;
          background: rgba(8, 14, 30, 0.42);
          border: 1px solid rgba(255,255,255,0.09);
          margin-bottom: 36px;
          position: relative;
          z-index: 2;
          max-width: 920px;
          width: 90%;
          backdrop-filter: blur(16px);
          clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
          box-shadow: 0 0 20px rgba(0,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .uni-text { display: flex; flex-direction: column; gap: 2px; }
        .uni-text strong { font-family: var(--font-game); font-size: 0.74rem; letter-spacing: 0.08em; color: var(--text-primary); }
        .uni-text span { font-size: 0.76rem; color: var(--text-secondary); }
        .uni-logo-img {
          height: 58px;
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
          filter: drop-shadow(0 0 10px rgba(0,255,255,0.45));
        }

        /* 3-column layout */
        .hero-three-col {
          display: grid;
          grid-template-columns: 230px 1fr 230px;
          gap: 28px;
          max-width: 1200px;
          width: 100%;
          padding: 0 24px;
          position: relative;
          z-index: 2;
          align-items: center;
        }

        /* Game panels */
        .game-panel {
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 460px;
          position: relative;
        }
        .game-panel-pubg {
          background: linear-gradient(180deg, rgba(0,18,45,0.97) 0%, rgba(0,5,18,0.92) 100%);
          border: 1px solid rgba(0,212,255,0.38);
          box-shadow: 0 0 48px rgba(0,212,255,0.14), inset 0 1px 0 rgba(0,212,255,0.1);
        }
        .game-panel-ff {
          background: linear-gradient(180deg, rgba(35,0,65,0.97) 0%, rgba(8,0,20,0.92) 100%);
          border: 1px solid rgba(160,80,255,0.42);
          box-shadow: 0 0 48px rgba(124,58,237,0.16), inset 0 1px 0 rgba(160,80,255,0.1);
        }

        /* Character art */
        .char-art {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.08)),
            radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 45%);
        }

        .char-art::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(4,8,18,0.08) 0%, rgba(4,8,18,0.68) 100%),
            radial-gradient(circle at center, transparent 35%, rgba(4,8,18,0.12) 100%);
          z-index: 2;
          pointer-events: none;
        }

        .char-glow {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 180%;
          height: 75%;
          border-radius: 50%;
          filter: blur(48px);
          z-index: 1;
          pointer-events: none;
        }
        .char-glow-pubg {
          background: radial-gradient(ellipse, rgba(0,212,255,0.28) 0%, rgba(0,100,200,0.15) 50%, transparent 75%);
        }
        .char-glow-ff {
          background: radial-gradient(ellipse, rgba(192,132,252,0.30) 0%, rgba(120,0,200,0.15) 50%, transparent 75%);
        }

        .char-photo {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-size: cover;
          background-repeat: no-repeat;
          transform: scale(1.02);
          filter: saturate(1.05) contrast(1.08) brightness(0.88);
        }

        .char-photo::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(3, 7, 18, 0.14) 0%, rgba(3, 7, 18, 0.78) 100%),
            linear-gradient(90deg, rgba(3, 7, 18, 0.42) 0%, transparent 35%, rgba(3, 7, 18, 0.3) 100%);
        }

        .char-photo-pubg {
          background-image: url('/images/pubg-poster.jpg');
          background-position: center center;
        }

        .char-photo-ff {
          background-image: url('/images/ff-poster.jpg');
          background-position: center center;
        }

        /* Panel overlay effects */
        .panel-scanline {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px);
          pointer-events: none;
          animation: scan 4s linear infinite;
          opacity: 0.5;
          z-index: 3;
        }
        @keyframes scan {
          0% { background-position: 0 0; }
          100% { background-position: 0 400px; }
        }

        /* Corner decorations */
        .panel-corner {
          position: absolute;
          width: 14px; height: 14px;
          border-color: rgba(0,212,255,0.5);
          border-style: solid;
          z-index: 4;
        }
        .game-panel-ff .panel-corner { border-color: rgba(160,80,255,0.5); }
        .panel-corner.tl { top: 8px; left: 8px; border-width: 2px 0 0 2px; }
        .panel-corner.tr { top: 8px; right: 8px; border-width: 2px 2px 0 0; }
        .panel-corner.bl { bottom: 8px; left: 8px; border-width: 0 0 2px 2px; }
        .panel-corner.br { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; }

        /* Panel footer */
        .game-panel-footer {
          padding: 14px 18px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(0,0,0,0.35);
        }
        .game-map-label {
          font-family: var(--font-game);
          font-size: 0.58rem;
          letter-spacing: 0.14em;
          color: var(--text-muted);
        }
        .game-logo-block { display: flex; flex-direction: column; align-items: center; line-height: 1.1; }
        .game-name-big {
          font-family: var(--font-game);
          font-size: 1.55rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }
        .game-name-sub {
          font-family: var(--font-game);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
        }
        .pubg-block .game-name-big { color: var(--cyan); text-shadow: 0 0 22px rgba(0,212,255,0.85); }
        .pubg-block .game-name-sub { color: rgba(0,212,255,0.65); }
        .ff-block .game-name-big { color: #c084fc; text-shadow: 0 0 22px rgba(192,132,252,0.85); }
        .ff-block .game-name-sub { color: rgba(192,132,252,0.65); }
        .game-type-label {
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        /* Center column */
        .hero-center-col {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          position: relative;
          z-index: 2;
          padding: 20px 0;
        }
        .hero-top-badge { margin-bottom: 0; }
        .hero-title-shell {
          width: 100%;
          max-width: 540px;
          position: relative;
        }
        .hero-title-shell::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(135deg, rgba(0,255,255,0.7), rgba(255,0,255,0.48), rgba(0,255,255,0.58));
          clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px));
          z-index: 0;
        }
        .hero-title-frame {
          position: relative;
          z-index: 1;
          padding: 28px 24px 24px;
          background:
            radial-gradient(circle at top, rgba(255,255,255,0.05), transparent 44%),
            linear-gradient(180deg, rgba(8, 15, 30, 0.82) 0%, rgba(6, 9, 20, 0.94) 100%);
          backdrop-filter: blur(18px);
          clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px));
          box-shadow: 0 0 30px rgba(0,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.05);
        }

        .hero-title-v2 {
          font-family: var(--font-game);
          font-size: clamp(2.25rem, 5vw, 4.85rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: 0.06em;
          color: var(--text-primary);
          text-shadow: 0 0 24px rgba(255,255,255,0.12);
        }
        .title-gaming {
          background: linear-gradient(135deg, var(--cyan) 0%, #63cbff 30%, #a955ff 65%, var(--purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 18px rgba(0,255,255,0.72));
        }
        .title-year {
          background: linear-gradient(135deg, var(--cyan) 0%, #63cbff 30%, #a955ff 65%, var(--purple) 100%);
          font-size: 58%;
          letter-spacing: 0.3em;
          text-shadow: 0 0 18px rgba(0,255,255,0.35), 0 0 32px rgba(255,0,255,0.2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-trophy-row { display: flex; justify-content: center; }
        .hero-trophy-ico {
          color: transparent;
          background: linear-gradient(135deg, var(--cyan) 0%, #63cbff 30%, #a955ff 65%, var(--purple) 100%);
          filter: drop-shadow(0 0 18px rgba(0,255,255,0.35)) drop-shadow(0 0 30px rgba(255,0,255,0.18));
          animation: float 3s ease-in-out infinite;
        }

        .hero-cta-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-btn-lg { padding: 14px 32px; font-size: 0.82rem; }
        .btn-pulse:hover {
          animation: pulseGlow 1.15s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 12px rgba(0,255,255,0.35), 0 0 24px rgba(0,255,255,0.2); }
          50% { box-shadow: 0 0 24px rgba(0,255,255,0.75), 0 0 48px rgba(255,0,255,0.35); }
          100% { box-shadow: 0 0 12px rgba(0,255,255,0.35), 0 0 24px rgba(0,255,255,0.2); }
        }

        .hero-cd-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .cd-label { font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.12em; text-transform: uppercase; }

        /* Info row */
        .hero-info-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          max-width: 1200px;
          width: 100%;
          margin-top: 32px;
          background: transparent;
          border: none;
          overflow: hidden;
          gap: 16px;
          position: relative;
          z-index: 2;
        }
        .info-box {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 22px;
          background: rgba(8, 14, 28, 0.58);
          border: 1px solid rgba(255,255,255,0.09);
          clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
          backdrop-filter: blur(16px);
        }
        .info-cyan { box-shadow: inset 0 0 0 1px rgba(0,255,255,0.14), 0 0 18px rgba(0,255,255,0.08); }
        .info-purple { box-shadow: inset 0 0 0 1px rgba(255,0,255,0.14), 0 0 18px rgba(255,0,255,0.08); }
        .ib-icon { flex-shrink: 0; }
        .info-cyan .ib-icon { color: var(--cyan); }
        .info-purple .ib-icon { color: #a78bfa; }
        .ib-label {
          display: block;
          font-family: var(--font-game);
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          margin-bottom: 5px;
        }
        .ib-value {
          display: block;
          font-family: var(--font-game);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.04em;
        }

        /* Award banner */
        .award-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          width: min(100%, 860px);
          padding: 15px 24px;
          background: linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(255,175,0,0.05) 100%);
          border: 1px solid rgba(255,215,0,0.28);
          margin-top: 18px;
          color: var(--gold);
          font-family: var(--font-game);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          position: relative;
          z-index: 2;
          clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
          backdrop-filter: blur(12px);
        }
        .award-banner svg { opacity: 0.75; }

        /* Responsive */
        @media (max-width: 1100px) {
          .hero-three-col { grid-template-columns: 180px 1fr 180px; gap: 16px; }
          .game-panel { height: 400px; }
          .hero-character-backdrop { width: min(32vw, 320px); opacity: 0.28; }
        }
        @media (max-width: 860px) {
          .hero-three-col { grid-template-columns: 1fr; }
          .game-panel { height: 160px; flex-direction: row; }
          .char-art { height: 160px; min-width: 44%; }
          .game-panel-footer { border-top: none; border-left: 1px solid rgba(255,255,255,0.07); flex-direction: row; gap: 12px; padding: 12px 16px; }
          .hero-info-row { grid-template-columns: 1fr; gap: 1px; }
          .uni-header { flex-direction: column; text-align: center; }
          .hero-character-backdrop {
            width: 42vw;
            opacity: 0.22;
          }
        }
        @media (max-width: 640px) {
          .hero-three-col { gap: 12px; }
          .hero-character-backdrop {
            width: 50vw;
            opacity: 0.18;
          }
          .game-panel {
            display: flex;
            height: auto;
            min-height: 250px;
            flex-direction: column;
          }
          .char-art {
            min-width: 100%;
            height: 170px;
          }
          .char-photo-pubg { background-position: center 18%; }
          .char-photo-ff { background-position: center 25%; }
          .game-panel-footer {
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.07);
            flex-direction: column;
            gap: 6px;
            padding: 12px;
          }
          .uni-header {
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 10px;
            align-items: center;
            text-align: left;
            padding: 10px 12px;
            margin-bottom: 18px;
          }
          .uni-logo-img { height: 40px; }
          .uni-text strong { font-size: 0.58rem; line-height: 1.25; }
          .uni-text span { font-size: 0.62rem; line-height: 1.3; }
          .hero-v2 { padding-top: 72px; }
          .award-banner { font-size: 0.62rem; gap: 8px; padding: 12px 16px; }
        }
      `}</style>
    </section>
  )
}

function DisciplinesSection() {
  const disciplines = [
    {
      id: 'pubg',
      name: 'PUBG Mobile',
      tag: 'Battle Royale',
      color: 'cyan',
      players: '4 игрока',
      format: 'Squads',
      map: 'Карта: Эрангель',
      icon: '🎯',
      poster: '/images/pubg-poster.jpg',
      accent: 'CYAN NODE',
      desc: 'Командный Battle Royale на выживание. Тактика, координация и меткость решают всё.',
    },
    {
      id: 'freefire',
      name: 'Free Fire',
      tag: 'Battle Royale',
      color: 'purple',
      players: '4 игрока',
      format: 'Squads',
      map: 'Карта: Бермуды',
      icon: '🔥',
      poster: '/images/ff-poster.jpg',
      accent: 'MAGENTA NODE',
      desc: 'Динамичный Battle Royale с уникальными персонажами и способностями. Скорость и реакция — ключ к победе.',
    },
  ]

  return (
    <section className="section">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <span className="badge badge-purple" style={{ display: 'table', margin: '0 auto 16px' }}>
              <Gamepad2 size={12} /> Дисциплины
            </span>
            <h2 className="section-title">Выбери свою <span className="gradient-cyan">игру</span></h2>
            <p className="section-subtitle">
              Два топовых мобильных Battle Royale — выбери дисциплину и веди свою команду к победе
            </p>
          </motion.div>

          <div className="grid-2">
            {disciplines.map((d) => (
              <motion.div key={d.id} variants={fadeUp}>
                <Link to={`/disciplines#${d.id}`} className={`discipline-card discipline-${d.color}`}>
                  <div className="discipline-media" style={{ backgroundImage: `linear-gradient(180deg, rgba(4,8,18,0.06), rgba(4,8,18,0.72)), url('${d.poster}')` }}>
                    <div className="discipline-media-chip">{d.accent}</div>
                  </div>
                  <div className="discipline-header">
                    <div className="discipline-headline-row">
                      <div className="discipline-emoji">{d.icon}</div>
                      <span className={`badge badge-${d.color}`}>{d.tag}</span>
                    </div>
                    <h3 className="discipline-name">{d.name}</h3>
                    <p className="discipline-desc">{d.desc}</p>
                  </div>
                  <div className="discipline-meta">
                    <div className="meta-item"><Users size={14} /><span>{d.players}</span></div>
                    <div className="meta-item"><Target size={14} /><span>{d.format}</span></div>
                    <div className="meta-item"><MapPin size={14} /><span>{d.map}</span></div>
                    <div className="meta-item"><Trophy size={14} /><span>Медали · Кубки</span></div>
                  </div>
                  <div className="discipline-cta">Подробнее <ChevronRight size={16} /></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .discipline-card {
          display: flex; flex-direction: column; gap: 20px;
          padding: 18px;
          background: var(--glass-bg);
          border-radius: 0;
          border: 1px solid var(--border);
          text-decoration: none; color: inherit;
          transition: all var(--transition);
          position: relative;
          overflow: hidden;
          clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px));
          backdrop-filter: blur(16px);
          min-height: 100%;
        }
        .discipline-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          opacity: 0.88;
          transition: opacity var(--transition);
          background: linear-gradient(135deg, rgba(0,255,255,0.6), rgba(255,0,255,0.42), rgba(0,255,255,0.45));
          z-index: 0;
        }
        .discipline-card > * { position: relative; z-index: 1; }
        .discipline-card::after {
          content: '';
          position: absolute;
          inset: 1px;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.06), transparent 26%),
            linear-gradient(180deg, rgba(8, 14, 26, 0.94), rgba(4, 8, 18, 0.94));
          clip-path: inherit;
          z-index: 0;
        }
        .discipline-card:hover::before { opacity: 1; }
        .discipline-cyan:hover { box-shadow: 0 0 30px rgba(0,255,255,0.2); transform: translateY(-6px); }
        .discipline-purple:hover { box-shadow: 0 0 30px rgba(255,0,255,0.18); transform: translateY(-6px); }
        .discipline-media {
          height: 190px;
          background-size: cover;
          background-position: center;
          border: 1px solid rgba(255,255,255,0.12);
          clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 -80px 80px rgba(3,8,18,0.55);
        }
        .discipline-media-chip {
          position: absolute;
          left: 14px;
          top: 14px;
          padding: 8px 12px;
          font-family: var(--font-game);
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          color: var(--text-primary);
          background: rgba(4, 8, 18, 0.72);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }
        .discipline-headline-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .discipline-emoji { font-size: 2rem; line-height: 1; filter: drop-shadow(0 0 12px rgba(255,255,255,0.2)); }
        .discipline-name {
          font-family: var(--font-game);
          font-size: 1.7rem;
          font-weight: 800;
          margin: 10px 0 8px;
          letter-spacing: 0.05em;
          text-shadow: 0 0 18px rgba(255,255,255,0.12);
        }
        .discipline-desc { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.65; }
        .discipline-meta { display: flex; gap: 16px; flex-wrap: wrap; }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-secondary);
          padding: 8px 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }
        .meta-item svg { opacity: 0.8; }
        .discipline-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--cyan);
          margin-top: auto;
          letter-spacing: 0.08em;
        }
        .discipline-purple .discipline-cta { color: #ff73ff; }
        @media (max-width: 640px) {
          .discipline-card { padding: 14px; }
          .discipline-media { height: 160px; }
        }
      `}</style>
    </section>
  )
}

function TimelineSection() {
  const events = [
    { date: '1–12 МАЯ', title: 'Регистрация команд', desc: 'Подай заявку с командой из 4 игроков', icon: <Users size={20} />, color: 'cyan' },
    { date: 'СКОРО', title: 'Подготовка', desc: 'Дата и детали уточняются', icon: <Target size={20} />, color: 'purple' },
    { date: '15 МАЯ', title: 'День турнира', desc: 'Групповой этап, плей-офф и финал', icon: <Trophy size={20} />, color: 'gold' },
    { date: '15 МАЯ', title: 'Церемония награждения', desc: 'Вручение медалей и кубков победителям', icon: <Star size={20} />, color: 'gold' },
  ]

  return (
    <section className="section timeline-section">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <span className="badge badge-cyan" style={{ display: 'table', margin: '0 auto 16px' }}>
              <Calendar size={12} /> Расписание
            </span>
            <h2 className="section-title">Ключевые <span className="gradient-purple">даты</span></h2>
            <p className="section-subtitle">Следи за расписанием, чтобы не пропустить важные события</p>
          </motion.div>

          <div className="timeline">
            {events.map((e, i) => (
              <motion.div key={i} className="timeline-item" variants={fadeUp}>
                <div className={`timeline-icon-wrap icon-${e.color}`}>{e.icon}</div>
                <div className="timeline-content">
                  <span className={`timeline-date date-${e.color}`}>{e.date}</span>
                  <h3 className="timeline-title">{e.title}</h3>
                  <p className="timeline-desc">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .timeline-section { background: var(--bg-secondary); }
        .timeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; position: relative; margin-top: 20px; }
        .timeline::before { content: ''; position: absolute; top: 36px; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, var(--cyan), var(--purple), var(--gold)); opacity: 0.3; }
        .timeline-item { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 16px; gap: 16px; }
        .timeline-icon-wrap { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; flex-shrink: 0; }
        .icon-cyan { background: var(--cyan-dim); border: 2px solid var(--border-cyan); color: var(--cyan); box-shadow: var(--glow-cyan); }
        .icon-purple { background: var(--purple-dim); border: 2px solid var(--border-purple); color: #a78bfa; box-shadow: var(--glow-purple); }
        .icon-gold { background: rgba(255,215,0,0.1); border: 2px solid rgba(255,215,0,0.3); color: var(--gold); box-shadow: 0 0 20px rgba(255,215,0,0.2); }
        .timeline-content { display: flex; flex-direction: column; gap: 6px; }
        .timeline-date { font-family: var(--font-game); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; }
        .date-cyan { color: var(--cyan); }
        .date-purple { color: #a78bfa; }
        .date-gold { color: var(--gold); }
        .timeline-title { font-weight: 700; font-size: 0.95rem; color: var(--text-primary); }
        .timeline-desc { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; }
        @media (max-width: 768px) {
          .timeline { grid-template-columns: 1fr; gap: 24px; }
          .timeline::before { display: none; }
          .timeline-item { flex-direction: row; text-align: left; }
        }
      `}</style>
    </section>
  )
}

function AboutSection() {
  const features = [
    { icon: <MapPin size={24} />, title: 'Локация', desc: 'ул. Тарсус, 1а, Манас. Кампус университета им. К.Ш. Токтоматова' },
    { icon: <Clock size={24} />, title: 'Формат', desc: 'Пока неизвестно' },
    { icon: <Users size={24} />, title: 'Участники', desc: 'Студенты университетов Кыргызстана. Команды по 4 человека' },
    { icon: <Trophy size={24} />, title: 'Призы', desc: 'Дипломы, медали, кубки и специальные награды от партнёров турнира' },
  ]

  return (
    <section className="section">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <span className="badge badge-cyan" style={{ display: 'table', margin: '0 auto 16px' }}>
              <Zap size={12} /> О турнире
            </span>
            <h2 className="section-title">
              Почему <span className="gradient-cyan">University Gaming League</span>?
            </h2>
            <p className="section-subtitle">
              Первый официальный университетский турнир по мобильному киберспорту в Кыргызстане
            </p>
          </motion.div>

          <div className="grid-4">
            {features.map((f, i) => (
              <motion.div key={i} className="feature-card" variants={fadeUp}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .feature-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 24px; transition: all var(--transition); display: flex; flex-direction: column; gap: 12px; }
        .feature-card:hover { border-color: var(--border-cyan); background: var(--bg-card-hover); transform: translateY(-4px); box-shadow: var(--glow-cyan); }
        .feature-icon { color: var(--cyan); filter: drop-shadow(0 0 8px rgba(0,212,255,0.4)); }
        .feature-title { font-family: var(--font-game); font-size: 0.85rem; font-weight: 700; letter-spacing: 0.05em; color: var(--text-primary); }
        .feature-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; }
      `}</style>
    </section>
  )
}

function NewsPreview() {
  const [news, setNews] = useState([])

  useEffect(() => {
    api.get('/news?limit=3')
      .then(res => setNews(res.data.items || []))
      .catch(() => {})
  }, [])

  return (
    <section className="section news-preview-section">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '12px' }}>Новости</span>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '0' }}>
                Последние <span className="gradient-purple">новости</span>
              </h2>
            </div>
            <Link to="/news" className="btn btn-secondary">Все новости <ChevronRight size={16} /></Link>
          </motion.div>

          {news.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              Новостей пока нет
            </div>
          ) : (
            <div className="grid-3">
              {news.map((n) => (
                <motion.div key={n.id} variants={fadeUp}>
                  <Link to={`/news/${n.id}`} className="news-card">
                    <div className="news-card-body">
                      <span className="badge badge-purple">{n.tag}</span>
                      <h3 className="news-title">{n.title}</h3>
                      <p className="news-excerpt">{n.excerpt}</p>
                    </div>
                    <div className="news-footer">
                      <span className="news-date">{fmt(n.created_at)}</span>
                      <span className="news-read">Читать <ChevronRight size={14} /></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .news-preview-section { background: var(--bg-secondary); }
        .news-card { display: flex; flex-direction: column; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; text-decoration: none; color: inherit; transition: all var(--transition); height: 100%; }
        .news-card:hover { border-color: var(--border-purple); transform: translateY(-4px); box-shadow: var(--glow-purple); }
        .news-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; gap: 12px; }
        .news-title { font-size: 1rem; font-weight: 700; line-height: 1.4; color: var(--text-primary); }
        .news-excerpt { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; }
        .news-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg-secondary); }
        .news-date { font-size: 0.78rem; color: var(--text-muted); }
        .news-read { display: flex; align-items: center; gap: 4px; font-size: 0.82rem; color: #a78bfa; font-weight: 600; transition: gap var(--transition); }
        .news-card:hover .news-read { gap: 6px; }
      `}</style>
    </section>
  )
}

function CTASection() {
  return (
    <section className="cta-section">
      <div className="container">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cta-orb" />
          <div className="cta-content">
            <span className="badge badge-gold" style={{ marginBottom: '20px' }}>
              <Clock size={12} /> Регистрация: 1–12 мая 2026
            </span>
            <h2 className="cta-title">
              Готов побороться за <span className="gradient-cyan">победу</span>?
            </h2>
            <p className="cta-desc">
              Собери команду из 4 игроков и зарегистрируйся уже сейчас.
              Турнир пройдёт 15 мая в Манасе!
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '0.85rem' }}>
                <Zap size={16} /> Зарегистрировать команду
              </Link>
              <Link to="/faq" className="btn btn-secondary">Вопросы и ответы</Link>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .cta-section { padding: 80px 0; background: var(--bg-primary); }
        .cta-card { background: var(--bg-card); border: 1px solid var(--border-cyan); border-radius: 24px; padding: 64px 48px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 0 60px rgba(0,212,255,0.05); }
        .cta-orb { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 600px; height: 300px; background: radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%); pointer-events: none; }
        .cta-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
        .cta-title { font-family: var(--font-game); font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 800; margin-bottom: 16px; letter-spacing: 0.03em; }
        .cta-desc { color: var(--text-secondary); max-width: 500px; margin: 0 auto 32px; line-height: 1.7; }
        .cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        @media (max-width: 640px) { .cta-card { padding: 40px 24px; } }
      `}</style>
    </section>
  )
}
