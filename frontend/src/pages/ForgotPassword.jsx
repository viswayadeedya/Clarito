import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

const orbs = [
  { size: 320, x: '10%',  y: '15%',  dur: '18s', delay: '0s',   color: 'rgba(99,102,241,0.13)'  },
  { size: 220, x: '75%',  y: '10%',  dur: '24s', delay: '-6s',  color: 'rgba(139,92,246,0.10)'  },
  { size: 280, x: '80%',  y: '65%',  dur: '20s', delay: '-10s', color: 'rgba(99,102,241,0.10)'  },
  { size: 180, x: '20%',  y: '70%',  dur: '22s', delay: '-4s',  color: 'rgba(167,139,250,0.08)' },
  { size: 140, x: '50%',  y: '85%',  dur: '16s', delay: '-8s',  color: 'rgba(99,102,241,0.09)'  },
  { size: 100, x: '40%',  y: '5%',   dur: '26s', delay: '-14s', color: 'rgba(139,92,246,0.07)'  },
]

function LockIcon({ unlocked }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shackle */}
      <path
        d="M16 22 L16 18 Q16 10 24 10 Q32 10 32 18 L32 22"
        stroke="#6366f1"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        style={{
          transformOrigin: '16px 18px',
          transform: unlocked ? 'translateX(-6px) rotate(-20deg)' : 'none',
          transition: 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      />
      {/* Body */}
      <rect x="10" y="22" width="28" height="20" rx="4" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeWidth="2.5"/>
      {/* Keyhole */}
      <circle cx="24" cy="31" r="3" fill="#6366f1" fillOpacity="0.8"/>
      <rect x="22.5" y="31" width="3" height="5" rx="1.5" fill="#6366f1" fillOpacity="0.8"/>
    </svg>
  )
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  // Animate lock open after mount
  useState(() => {
    const t = setTimeout(() => setUnlocked(true), 600)
    return () => clearTimeout(t)
  })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes orbDrift {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(40px, -30px) scale(1.08); }
          66%  { transform: translate(-25px, 20px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes successPop {
          0%   { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        .fp-card {
          animation: cardIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }
        .fp-input {
          width: 100%;
          padding: 11px 14px;
          background: rgba(255,255,255,0.04);
          color: #fff;
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 10px;
          font-size: 14px;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          font-family: system-ui, sans-serif;
        }
        .fp-input::placeholder { color: #3f3f46; }
        .fp-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
        }
        .fp-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #6366f1, #818cf8, #6366f1);
          background-size: 200% auto;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          font-family: system-ui, sans-serif;
        }
        .fp-btn:hover:not(:disabled) {
          animation: shimmer 1.2s linear infinite;
          transform: scale(1.02);
          box-shadow: 0 4px 28px rgba(99,102,241,0.5);
        }
        .fp-btn:active:not(:disabled) { transform: scale(0.98); }
        .fp-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .fp-back {
          color: #52525b;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .fp-back:hover { color: #a1a1aa; }
        .fp-success {
          animation: successPop 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>

      {/* Full page */}
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}>
        {/* Floating orbs */}
        {orbs.map((orb, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              animation: `orbDrift ${orb.dur} ease-in-out ${orb.delay} infinite`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Glass card */}
        <div
          className="fp-card"
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '400px',
            margin: '24px',
            padding: '40px 36px',
            background: 'rgba(20,20,20,0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '20px',
            boxShadow: '0 0 40px rgba(99,102,241,0.08), 0 24px 48px rgba(0,0,0,0.5)',
          }}
        >
          {submitted ? (
            <div className="fp-success" style={{ textAlign: 'center' }}>
              {/* Envelope icon */}
              <div style={{ marginBottom: '20px' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="6" y="12" width="36" height="26" rx="4" stroke="#6366f1" strokeWidth="2.5" fill="rgba(99,102,241,0.1)"/>
                  <path d="M6 16 L24 28 L42 16" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', margin: '0 0 10px' }}>
                Check your inbox
              </h2>
              <p style={{ color: '#71717a', fontSize: '14px', lineHeight: '1.6', margin: '0 0 28px' }}>
                If that email is registered, a reset link is on its way. It may take a minute.
              </p>
              <Link to="/login" className="fp-back">← Back to login</Link>
            </div>
          ) : (
            <>
              {/* Lock icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <LockIcon unlocked={unlocked} />
              </div>

              <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 8px', textAlign: 'center' }}>
                Forgot password?
              </h2>
              <p style={{ color: '#52525b', fontSize: '13.5px', lineHeight: '1.6', textAlign: 'center', margin: '0 0 28px' }}>
                Happens to the best of us. Enter your email and we'll get you back in.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', color: '#71717a', fontSize: '12px', fontWeight: '500', marginBottom: '6px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="fp-input"
                  />
                </div>

                {error && (
                  <p style={{ color: '#f87171', fontSize: '13px', margin: 0 }}>{error}</p>
                )}

                <button type="submit" disabled={loading} className="fp-btn" style={{ marginTop: '4px' }}>
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/login" className="fp-back">← Back to login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
