import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'

const strokes = [
  { d: 'M 60 100 Q 220 50 380 150 T 500 280', dur: '3s',   delay: '0.2s' },
  { d: 'M 30 320 Q 160 260 300 340 Q 420 400 460 320', dur: '2.8s', delay: '0.8s' },
  { d: 'M 120 480 L 400 480', dur: '2s',   delay: '1.4s' },
  { d: 'M 80 180 L 260 180 L 260 300 L 80 300 Z', dur: '3s',   delay: '2s'   },
  { d: 'M 300 520 Q 380 460 440 540 Q 490 610 380 640 Q 270 670 260 590', dur: '3.5s', delay: '2.6s' },
  { d: 'M 40 660 Q 160 620 280 660 T 490 640', dur: '2.5s', delay: '3.2s' },
  { d: 'M 360 70 Q 430 130 410 210 Q 390 290 450 330', dur: '2.8s', delay: '1.3s' },
  { d: 'M 50 420 L 130 380 L 210 410 L 310 360 L 420 400', dur: '2.2s', delay: '3.7s' },
]

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        .r-wordmark  { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .r-tagline   { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.4s  both; }
        .r-form-side { animation: fadeIn 0.7s ease 0.1s both; }
        .r-stroke {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: draw linear forwards;
        }
        .r-input {
          width: 100%;
          padding: 11px 14px;
          background: #1c1c1c;
          color: #fff;
          border: 1px solid #27272a;
          border-radius: 10px;
          font-size: 14px;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .r-input::placeholder { color: #52525b; }
        .r-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
        }
        .r-btn {
          width: 100%;
          padding: 12px;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
        }
        .r-btn:hover:not(:disabled) {
          background: #4f46e5;
          transform: scale(1.02);
          box-shadow: 0 4px 24px rgba(99,102,241,0.45);
        }
        .r-btn:active:not(:disabled) { transform: scale(0.98); }
        .r-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .r-ghost-link {
          color: #52525b;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.15s;
        }
        .r-ghost-link:hover { color: #a1a1aa; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

        {/* ── Left panel ── */}
        <div style={{
          width: '40%',
          background: '#0f0f0f',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}>
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox="0 0 520 800"
            preserveAspectRatio="xMidYMid slice"
          >
            {strokes.map((s, i) => (
              <path
                key={i}
                d={s.d}
                stroke="#6366f1"
                strokeOpacity="0.13"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="r-stroke"
                style={{ animationDuration: s.dur, animationDelay: s.delay }}
              />
            ))}
          </svg>

          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <div className="r-wordmark">
              <span style={{
                fontSize: '72px',
                fontWeight: '800',
                color: '#6366f1',
                letterSpacing: '-3px',
                lineHeight: 1,
                display: 'block',
              }}>
                Clarito
              </span>
            </div>
            <p className="r-tagline" style={{
              color: '#3f3f46',
              fontSize: '14px',
              letterSpacing: '0.5px',
              marginTop: '12px',
            }}>
              Start your clarity journey
            </p>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="r-form-side" style={{
          width: '60%',
          background: '#141414',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}>
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', margin: '0 0 6px 0' }}>
              Create account
            </h2>
            <p style={{ color: '#52525b', fontSize: '14px', margin: '0 0 32px 0' }}>
              Join Clarito and start learning visually
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#71717a', fontSize: '12px', fontWeight: '500', marginBottom: '6px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  className="r-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#71717a', fontSize: '12px', fontWeight: '500', marginBottom: '6px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  className="r-input"
                />
              </div>

              {error && (
                <p style={{ color: '#f87171', fontSize: '13px', margin: '-4px 0 0' }}>{error}</p>
              )}

              <button type="submit" disabled={loading} className="r-btn" style={{ marginTop: '4px' }}>
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <span style={{ color: '#3f3f46', fontSize: '13px' }}>Already have an account? </span>
              <Link to="/login" className="r-ghost-link" style={{ fontSize: '13px' }}>Sign in →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
