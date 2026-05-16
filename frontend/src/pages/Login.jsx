import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'

const strokes = [
  { d: 'M 30 120 Q 180 60 340 160 T 500 300', dur: '3.2s', delay: '0.2s' },
  { d: 'M 60 380 Q 200 320 320 400 Q 420 460 460 380', dur: '2.8s', delay: '0.9s' },
  { d: 'M 20 560 L 480 560', dur: '2s', delay: '1.6s' },
  { d: 'M 100 220 L 280 220 L 280 340 L 100 340 Z', dur: '3s', delay: '2.2s' },
  { d: 'M 320 480 Q 400 420 460 500 Q 500 560 400 600 Q 300 640 280 560', dur: '3.5s', delay: '2.8s' },
  { d: 'M 40 680 Q 160 640 280 680 T 500 660', dur: '2.5s', delay: '3.4s' },
  { d: 'M 380 80 Q 440 140 420 220 Q 400 300 460 340', dur: '2.8s', delay: '1.4s' },
  { d: 'M 50 460 L 120 420 L 200 450 L 300 400 L 400 440', dur: '2.2s', delay: '3.8s' },
]

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('username', form.email)
      params.append('password', form.password)
      const { data } = await api.post('/auth/login', params)
      localStorage.setItem('token', data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials')
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
        .wordmark  { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .tagline   { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.4s  both; }
        .form-side { animation: fadeIn 0.7s ease 0.1s both; }
        .stroke    {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: draw linear forwards;
        }
        .clarito-input {
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
        .clarito-input::placeholder { color: #52525b; }
        .clarito-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
        }
        .clarito-btn {
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
        .clarito-btn:hover:not(:disabled) {
          background: #4f46e5;
          transform: scale(1.02);
          box-shadow: 0 4px 24px rgba(99,102,241,0.45);
        }
        .clarito-btn:active:not(:disabled) { transform: scale(0.98); }
        .clarito-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .ghost-link {
          color: #52525b;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.15s;
        }
        .ghost-link:hover { color: #a1a1aa; }
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
          {/* Animated canvas strokes */}
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
                className="stroke"
                style={{ animationDuration: s.dur, animationDelay: s.delay }}
              />
            ))}
          </svg>

          {/* Wordmark + tagline */}
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <div className="wordmark">
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
            <p className="tagline" style={{
              color: '#3f3f46',
              fontSize: '14px',
              letterSpacing: '0.5px',
              marginTop: '12px',
            }}>
              Where understanding clicks
            </p>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="form-side" style={{
          width: '60%',
          background: '#141414',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}>
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', margin: '0 0 6px 0' }}>
              Welcome back
            </h2>
            <p style={{ color: '#52525b', fontSize: '14px', margin: '0 0 32px 0' }}>
              Sign in to continue
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
                  className="clarito-input"
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
                  className="clarito-input"
                />
              </div>

              {error && (
                <p style={{ color: '#f87171', fontSize: '13px', margin: '-4px 0 0' }}>{error}</p>
              )}

              <button type="submit" disabled={loading} className="clarito-btn" style={{ marginTop: '4px' }}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Link to="/forgot-password" className="ghost-link">Forgot password?</Link>
              <Link to="/register" className="ghost-link">Create account →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
