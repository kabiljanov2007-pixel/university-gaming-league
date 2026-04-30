import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Users, Zap, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import api from '../hooks/useApi'

const STEPS = ['Дисциплина', 'Команда', 'Игроки', 'Подтверждение']

const fadeSlide = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
}

export default function Register() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, control, formState: { errors }, trigger } = useForm({
    defaultValues: {
      discipline: '',
      teamName: '',
      university: '',
      contactName: '',
      contactPhone: '',
      contactTelegram: '',
      members: [
        { name: '', gameNickname: '', studentId: '' },
        { name: '', gameNickname: '', studentId: '' },
        { name: '', gameNickname: '', studentId: '' },
        { name: '', gameNickname: '', studentId: '' },
      ],
    },
  })

  const { fields } = useFieldArray({ control, name: 'members' })
  const watchedData = watch()

  const nextStep = async () => {
    let fields = []
    if (step === 0) fields = ['discipline']
    if (step === 1) fields = ['teamName', 'university', 'contactName', 'contactPhone']
    if (step === 2) fields = watchedData.members.map((_, i) => [ // eslint-disable-line
      `members.${i}.name`, `members.${i}.gameNickname`, `members.${i}.studentId`
    ]).flat()

    const valid = await trigger(fields)
    if (valid) setStep(s => s + 1)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/teams/register', data)
      setSubmitted(true)
      toast.success('Заявка отправлена! Ожидайте подтверждения.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка при отправке заявки')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return <SuccessScreen teamName={watchedData.teamName} />

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-cyan" style={{ marginBottom: '16px' }}>
              <Users size={12} />
              Регистрация
            </span>
            <h1 className="section-title">
              Регистрация <span className="gradient-cyan">команды</span>
            </h1>
            <p className="section-subtitle">
              Заполни форму, чтобы зарегистрировать свою команду. Регистрация открыта с 1 по 12 мая.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="register-wrapper">
            <StepIndicator current={step} steps={STEPS} />

            <div className="register-form-card">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="step0" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                      <Step0 register={register} errors={errors} watch={watch} />
                    </motion.div>
                  )}
                  {step === 1 && (
                    <motion.div key="step1" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                      <Step1 register={register} errors={errors} />
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="step2" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                      <Step2 register={register} errors={errors} fields={fields} />
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="step3" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                      <Step3 data={watchedData} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="form-navigation">
                  {step > 0 && (
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
                      <ChevronLeft size={16} /> Назад
                    </button>
                  )}
                  {step < 3 ? (
                    <button type="button" className="btn btn-primary" onClick={nextStep} style={{ marginLeft: 'auto' }}>
                      Далее <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto' }} disabled={loading}>
                      {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <Zap size={16} />}
                      {loading ? 'Отправка...' : 'Отправить заявку'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .register-wrapper {
          max-width: 720px;
          margin: 0 auto;
        }

        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
          gap: 0;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-game);
          font-size: 0.85rem;
          font-weight: 700;
          border: 2px solid var(--border);
          background: var(--bg-card);
          color: var(--text-muted);
          transition: all 0.3s;
          position: relative;
          z-index: 1;
        }

        .step-circle.active {
          border-color: var(--cyan);
          background: var(--cyan-dim);
          color: var(--cyan);
          box-shadow: var(--glow-cyan);
        }

        .step-circle.done {
          border-color: var(--cyan);
          background: var(--cyan);
          color: #000;
        }

        .step-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .step-label.active { color: var(--cyan); }

        .step-line {
          flex: 1;
          height: 2px;
          background: var(--border);
          margin: 0 8px;
          margin-bottom: 28px;
          transition: background 0.3s;
        }

        .step-line.done { background: var(--cyan); }

        .register-form-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 40px;
        }

        .step-title {
          font-family: var(--font-game);
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 28px;
          color: var(--text-primary);
        }

        .step-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .full-width { grid-column: 1 / -1; }

        .form-navigation {
          display: flex;
          align-items: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          gap: 16px;
        }

        .discipline-select-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 8px;
        }

        .discipline-option {
          border: 2px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          cursor: pointer;
          transition: all var(--transition);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          background: var(--bg-secondary);
        }

        .discipline-option:hover { border-color: var(--border-cyan); }

        .discipline-option.selected-cyan {
          border-color: var(--cyan);
          background: var(--cyan-dim);
          box-shadow: var(--glow-cyan);
        }

        .discipline-option.selected-purple {
          border-color: var(--purple);
          background: var(--purple-dim);
          box-shadow: var(--glow-purple);
        }

        .disc-opt-emoji { font-size: 2.5rem; }
        .disc-opt-name { font-family: var(--font-game); font-size: 0.9rem; font-weight: 700; }
        .disc-opt-desc { font-size: 0.78rem; color: var(--text-muted); }

        .member-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          margin-bottom: 16px;
        }

        .member-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .member-num {
          font-family: var(--font-game);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--cyan);
          letter-spacing: 0.1em;
        }

        .btn-remove {
          color: #ef4444;
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          transition: all var(--transition);
        }

        .btn-remove:hover { background: rgba(239, 68, 68, 0.2); }

        .btn-add-member {
          width: 100%;
          padding: 14px;
          border: 2px dashed var(--border);
          border-radius: var(--radius);
          color: var(--text-muted);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all var(--transition);
          background: transparent;
        }

        .btn-add-member:hover {
          border-color: var(--border-cyan);
          color: var(--cyan);
          background: var(--cyan-dim);
        }

        .confirm-section { margin-bottom: 24px; }
        .confirm-label {
          font-family: var(--font-game);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--cyan);
          margin-bottom: 12px;
        }

        .confirm-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .confirm-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
        }

        .confirm-key { color: var(--text-muted); }
        .confirm-val { color: var(--text-primary); font-weight: 500; }

        .members-list { display: flex; flex-direction: column; gap: 6px; }
        .member-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
        }

        .agree-text {
          font-size: 0.82rem;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
          padding: 16px;
          border-left: 3px solid var(--cyan);
        }

        @media (max-width: 640px) {
          .register-form-card { padding: 24px 16px; }
          .step-form-grid { grid-template-columns: 1fr; }
          .discipline-select-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}

function StepIndicator({ current, steps }) {
  return (
    <div className="step-indicator">
      {steps.map((label, i) => (
        <div key={i} style={{ display: 'contents' }}>
          <div className="step-item">
            <div className={`step-circle ${i === current ? 'active' : i < current ? 'done' : ''}`}>
              {i < current ? <Check size={16} /> : i + 1}
            </div>
            <span className={`step-label ${i === current ? 'active' : ''}`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`step-line ${i < current ? 'done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function Step0({ register, errors, watch }) {
  const selected = watch('discipline')
  return (
    <div>
      <p className="step-title">Выбери дисциплину</p>
      <div className="discipline-select-grid">
        {[
          { value: 'pubg', emoji: '🎯', name: 'PUBG Mobile', desc: 'Squads · 4 игрока', colorClass: 'cyan' },
          { value: 'freefire', emoji: '🔥', name: 'Free Fire', desc: 'Squads · 4 игрока', colorClass: 'purple' },
        ].map(d => (
          <label
            key={d.value}
            className={`discipline-option ${selected === d.value ? `selected-${d.colorClass}` : ''}`}
          >
            <input type="radio" value={d.value} {...register('discipline', { required: 'Выбери дисциплину' })} style={{ display: 'none' }} />
            <span className="disc-opt-emoji">{d.emoji}</span>
            <span className="disc-opt-name">{d.name}</span>
            <span className="disc-opt-desc">{d.desc}</span>
          </label>
        ))}
      </div>
      {errors.discipline && <p className="form-error" style={{ marginTop: 8 }}>{errors.discipline.message}</p>}
    </div>
  )
}

function Step1({ register, errors }) {
  return (
    <div>
      <p className="step-title">Информация о команде</p>
      <div className="step-form-grid">
        <div className="form-group full-width">
          <label className="form-label">Название команды *</label>
          <input
            className={`form-input ${errors.teamName ? 'error' : ''}`}
            placeholder="Например: Steppe Lions"
            {...register('teamName', { required: 'Введите название команды', minLength: { value: 2, message: 'Минимум 2 символа' }, maxLength: { value: 30, message: 'Максимум 30 символов' } })}
          />
          {errors.teamName && <p className="form-error">{errors.teamName.message}</p>}
        </div>

        <div className="form-group full-width">
          <label className="form-label">Университет *</label>
          <select className={`form-select ${errors.university ? 'error' : ''}`} {...register('university', { required: 'Выберите университет' })}>
            <option value="">— Выберите университет —</option>
            <option>Университет им. К.Ш. Токтоматова</option>
            <option>КГТУ им. И. Раззакова</option>
            <option>КНУ им. Ж. Баласагына</option>
            <option>КГМУ им. И.К. Ахунбаева</option>
            <option>Международный университет Кыргызстана</option>
            <option>АУЦА</option>
            <option>Другой университет</option>
          </select>
          {errors.university && <p className="form-error">{errors.university.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Имя капитана *</label>
          <input
            className={`form-input ${errors.contactName ? 'error' : ''}`}
            placeholder="Полное имя"
            {...register('contactName', { required: 'Введите имя капитана' })}
          />
          {errors.contactName && <p className="form-error">{errors.contactName.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Номер телефона *</label>
          <input
            className={`form-input ${errors.contactPhone ? 'error' : ''}`}
            placeholder="+996 XXX XXX XXX"
            {...register('contactPhone', {
              required: 'Введите номер телефона',
              pattern: { value: /^\+?[0-9\s\-()]{9,15}$/, message: 'Неверный формат' }
            })}
          />
          {errors.contactPhone && <p className="form-error">{errors.contactPhone.message}</p>}
        </div>

        <div className="form-group full-width">
          <label className="form-label">Telegram (необязательно)</label>
          <input
            className="form-input"
            placeholder="@username"
            {...register('contactTelegram')}
          />
        </div>
      </div>
    </div>
  )
}

function Step2({ register, errors, fields }) {
  return (
    <div>
      <p className="step-title">Состав команды — 4 игрока</p>
      {fields.map((field, i) => (
        <div key={field.id} className="member-card">
          <div className="member-card-header">
            <span className="member-num">ИГРОК {i + 1}{i === 0 ? ' · КАПИТАН' : ''}</span>
          </div>
          <div className="step-form-grid">
            <div className="form-group">
              <label className="form-label">Имя и фамилия *</label>
              <input
                className={`form-input ${errors.members?.[i]?.name ? 'error' : ''}`}
                placeholder="Реальное имя"
                {...register(`members.${i}.name`, { required: 'Обязательное поле' })}
              />
              {errors.members?.[i]?.name && <p className="form-error">{errors.members[i].name.message}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Игровой ник *</label>
              <input
                className={`form-input ${errors.members?.[i]?.gameNickname ? 'error' : ''}`}
                placeholder="NickName#1234"
                {...register(`members.${i}.gameNickname`, { required: 'Обязательное поле' })}
              />
              {errors.members?.[i]?.gameNickname && <p className="form-error">{errors.members[i].gameNickname.message}</p>}
            </div>
            <div className="form-group full-width">
              <label className="form-label">Номер студ. билета *</label>
              <input
                className={`form-input ${errors.members?.[i]?.studentId ? 'error' : ''}`}
                placeholder="Например: 2022-0001"
                {...register(`members.${i}.studentId`, { required: 'Обязательное поле' })}
              />
              {errors.members?.[i]?.studentId && <p className="form-error">{errors.members[i].studentId.message}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Step3({ data }) {
  const discLabel = data.discipline === 'pubg' ? '🎯 PUBG Mobile' : '🔥 Free Fire'
  return (
    <div>
      <p className="step-title">Проверь данные перед отправкой</p>

      <div className="confirm-section">
        <p className="confirm-label">Дисциплина</p>
        <div className="confirm-grid">
          <div className="confirm-row">
            <span className="confirm-key">Игра</span>
            <span className="confirm-val">{discLabel}</span>
          </div>
        </div>
      </div>

      <div className="confirm-section">
        <p className="confirm-label">Команда</p>
        <div className="confirm-grid">
          <div className="confirm-row">
            <span className="confirm-key">Название</span>
            <span className="confirm-val">{data.teamName}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-key">Университет</span>
            <span className="confirm-val">{data.university}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-key">Капитан</span>
            <span className="confirm-val">{data.contactName}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-key">Телефон</span>
            <span className="confirm-val">{data.contactPhone}</span>
          </div>
        </div>
      </div>

      <div className="confirm-section">
        <p className="confirm-label">Игроки ({data.members?.length})</p>
        <div className="members-list">
          {data.members?.map((m, i) => (
            <div key={i} className="member-row">
              <span style={{ color: 'var(--text-muted)' }}>#{i + 1} {m.name}</span>
              <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-game)', fontSize: '0.8rem' }}>{m.gameNickname}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="agree-text">
        Нажимая «Отправить заявку», вы подтверждаете, что все данные верны, все участники являются студентами и согласны с правилами турнира Cyber Cup 2026.
      </p>
    </div>
  )
}

function SuccessScreen({ teamName }) {
  return (
    <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--cyan), #00a3ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', boxShadow: 'var(--glow-cyan)'
          }}>
            <Check size={48} color="#000" strokeWidth={3} />
          </div>
          <h2 className="section-title">Заявка принята!</h2>
          <p className="section-subtitle" style={{ marginBottom: '32px' }}>
            Команда <strong style={{ color: 'var(--cyan)' }}>«{teamName}»</strong> успешно зарегистрирована.
            Мы свяжемся с вами для подтверждения. Следите за новостями!
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <a href="/" className="btn btn-primary"><Zap size={16} /> На главную</a>
            <a href="/teams" className="btn btn-secondary"><Users size={16} /> Список команд</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
