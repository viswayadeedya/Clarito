import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

const strokes = [
  { d: 'M -40 180 Q 200 80 500 200 T 1100 320',  dur: '4s',   delay: '0.2s'  },
  { d: 'M 100 500 Q 350 400 600 480 Q 850 560 1000 460', dur: '3.5s', delay: '1s' },
  { d: 'M 0 700 L 900 700',                        dur: '3s',   delay: '1.8s'  },
  { d: 'M 200 120 L 480 120 L 480 300 L 200 300 Z',dur: '3.5s', delay: '2.6s'  },
  { d: 'M 700 550 Q 820 480 900 580 Q 980 680 860 720 Q 740 760 720 660', dur: '4s', delay: '3.2s' },
  { d: 'M 50 820 Q 300 770 550 820 T 1050 800',   dur: '3s',   delay: '3.8s'  },
  { d: 'M 820 80 Q 920 160 890 280 Q 860 400 960 460', dur: '3.5s', delay: '1.5s' },
  { d: 'M 60 400 L 180 340 L 320 380 L 480 300',  dur: '2.8s', delay: '4.2s'  },
]

function CanvasMockup() {
  return (
    <svg width="560" height="300" viewBox="0 0 560 300" fill="none" style={{ maxWidth: '100%' }}>
      {/* Canvas background */}
      <rect x="1" y="1" width="558" height="298" rx="12"
        fill="rgba(20,20,20,0.8)" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5"/>

      {/* Grid dots */}
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 14 }, (_, col) => (
          <circle key={`${row}-${col}`}
            cx={30 + col * 38} cy={30 + row * 36} r="1"
            fill="rgba(99,102,241,0.12)"/>
        ))
      )}

      {/* Sketch elements on canvas */}
      <rect x="40" y="60" width="100" height="60" rx="6"
        stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" fill="rgba(99,102,241,0.05)"
        strokeDasharray="4 3"/>
      <text x="90" y="95" textAnchor="middle" fill="rgba(99,102,241,0.6)" fontSize="10" fontFamily="system-ui">Concept A</text>

      <rect x="180" y="40" width="100" height="60" rx="6"
        stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" fill="rgba(99,102,241,0.04)"/>
      <text x="230" y="75" textAnchor="middle" fill="rgba(99,102,241,0.5)" fontSize="10" fontFamily="system-ui">Concept B</text>

      <path d="M 140 90 L 180 70" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M 174 65 L 180 70 L 174 75" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

      <rect x="100" y="160" width="120" height="55" rx="6"
        stroke="rgba(99,102,241,0.35)" strokeWidth="1.5" fill="rgba(99,102,241,0.04)"/>
      <text x="160" y="192" textAnchor="middle" fill="rgba(99,102,241,0.45)" fontSize="10" fontFamily="system-ui">Concept C</text>

      <path d="M 160 120 L 160 160" stroke="rgba(99,102,241,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/>

      {/* Selection box — animated dashes */}
      <rect x="28" y="48" width="270" height="190" rx="8"
        stroke="#6366f1" strokeWidth="2" fill="rgba(99,102,241,0.04)"
        strokeDasharray="8 4">
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.2s" repeatCount="indefinite"/>
      </rect>

      {/* Selection handles */}
      {[[28,48],[168,48],[298,48],[28,143],[298,143],[28,238],[168,238],[298,238]].map(([x,y], i) => (
        <rect key={i} x={x-3} y={y-3} width="6" height="6" rx="1"
          fill="#6366f1" opacity="0.8"/>
      ))}

      {/* Chat panel */}
      <rect x="318" y="20" width="222" height="260" rx="10"
        fill="rgba(15,15,15,0.95)" stroke="rgba(99,102,241,0.3)" strokeWidth="1.5"/>

      {/* Chat header */}
      <rect x="318" y="20" width="222" height="36" rx="10"
        fill="rgba(99,102,241,0.12)"/>
      <rect x="318" y="44" width="222" height="12" rx="0" fill="rgba(99,102,241,0.12)"/>
      <circle cx="336" cy="38" r="6" fill="#6366f1" opacity="0.7"/>
      <text x="348" y="42" fill="rgba(255,255,255,0.8)" fontSize="9" fontFamily="system-ui" fontWeight="600">AI Mentor</text>

      {/* Chat messages */}
      <rect x="330" y="68" width="140" height="28" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.2)" strokeWidth="1"/>
      <text x="338" y="80" fill="rgba(255,255,255,0.6)" fontSize="7.5" fontFamily="system-ui">What connects Concept A</text>
      <text x="338" y="90" fill="rgba(255,255,255,0.6)" fontSize="7.5" fontFamily="system-ui">and B in your diagram?</text>

      <rect x="346" y="106" width="182" height="44" rx="6" fill="rgba(99,102,241,0.25)" stroke="rgba(99,102,241,0.35)" strokeWidth="1"/>
      <text x="354" y="118" fill="rgba(255,255,255,0.75)" fontSize="7.5" fontFamily="system-ui">Both feed into the core loop.</text>
      <text x="354" y="130" fill="rgba(255,255,255,0.75)" fontSize="7.5" fontFamily="system-ui">A triggers the condition that</text>
      <text x="354" y="142" fill="rgba(255,255,255,0.75)" fontSize="7.5" fontFamily="system-ui">B depends on to activate.</text>

      <rect x="330" y="160" width="120" height="20" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.2)" strokeWidth="1"/>
      <text x="338" y="174" fill="rgba(255,255,255,0.55)" fontSize="7.5" fontFamily="system-ui">Can you explain Concept C?</text>

      {/* Typing indicator */}
      <rect x="346" y="190" width="50" height="20" rx="6" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.3)" strokeWidth="1"/>
      <circle cx="358" cy="200" r="2.5" fill="#6366f1" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.2s" begin="0s" repeatCount="indefinite"/>
      </circle>
      <circle cx="368" cy="200" r="2.5" fill="#6366f1" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="378" cy="200" r="2.5" fill="#6366f1" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.2s" begin="0.8s" repeatCount="indefinite"/>
      </circle>

      {/* Input bar */}
      <rect x="326" y="254" width="206" height="20" rx="5"
        fill="rgba(255,255,255,0.04)" stroke="rgba(99,102,241,0.2)" strokeWidth="1"/>
      <text x="334" y="268" fill="rgba(255,255,255,0.2)" fontSize="7.5" fontFamily="system-ui">Ask about your canvas...</text>
    </svg>
  )
}

export default function AIMentor() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | duplicate | error
  const inputRef = useRef(null)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      await api.post('/waitlist/', { email: email.trim() })
      setStatus('success')
    } catch (err) {
      if (err.response?.status === 409) setStatus('duplicate')
      else setStatus('error')
    }
  }

  return (
    <>
      <style>{`
        @keyframes aim-draw { to { stroke-dashoffset: 0; } }
        @keyframes aim-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes aim-badge {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        .aim-stroke {
          stroke-dasharray: 1600;
          stroke-dashoffset: 1600;
          animation: aim-draw linear forwards;
        }
        .aim-hero   { animation: aim-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .aim-mockup { animation: aim-in 0.8s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .aim-form   { animation: aim-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
        .aim-badge  { animation: aim-badge 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .aim-input {
          flex: 1; min-width: 0;
          padding: 12px 16px;
          background: rgba(255,255,255,0.04);
          color: #fff;
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          font-family: system-ui, sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .aim-input::placeholder { color: #52525b; }
        .aim-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
        }
        .aim-btn {
          padding: 12px 24px;
          background: #6366f1; color: #fff;
          border: none; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          cursor: pointer; white-space: nowrap;
          font-family: system-ui, sans-serif;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .aim-btn:hover:not(:disabled) {
          background: #4f46e5;
          transform: scale(1.03);
          box-shadow: 0 4px 20px rgba(99,102,241,0.45);
        }
        .aim-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0f0f0f', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>

        {/* Background strokes */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 1100 900" preserveAspectRatio="xMidYMid slice">
          {strokes.map((s, i) => (
            <path key={i} d={s.d}
              stroke="#6366f1" strokeOpacity="0.07" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" fill="none"
              className="aim-stroke"
              style={{ animationDuration: s.dur, animationDelay: s.delay }}
            />
          ))}
        </svg>

        {/* Navbar */}
        <nav style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: '60px',
          borderBottom: '1px solid rgba(99,102,241,0.1)',
        }}>
          <Link to="/" style={{ fontSize: '21px', fontWeight: '800', color: '#6366f1', letterSpacing: '-1px', textDecoration: 'none' }}>
            Clarito
          </Link>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" style={{
              padding: '8px 16px', background: 'transparent', color: '#71717a',
              border: '1px solid #27272a', borderRadius: '9px', fontSize: '13.5px',
              textDecoration: 'none', fontFamily: 'system-ui, sans-serif',
              transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.borderColor = '#3f3f46' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.borderColor = '#27272a' }}
            >Login</Link>
            <Link to="/register" style={{
              padding: '8px 16px', background: '#6366f1', color: '#fff',
              border: 'none', borderRadius: '9px', fontSize: '13.5px', fontWeight: '600',
              textDecoration: 'none', fontFamily: 'system-ui, sans-serif',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
              onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
            >Get started</Link>
          </div>
        </nav>

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 10,
          maxWidth: '800px', margin: '0 auto',
          padding: '60px 32px 80px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>

          {/* Badge */}
          <div className="aim-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '999px',
            fontSize: '12px', fontWeight: '600', color: '#818cf8',
            letterSpacing: '0.5px', textTransform: 'uppercase',
            marginBottom: '28px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', display: 'inline-block' }}/>
            Coming soon
          </div>

          {/* Headline */}
          <div className="aim-hero">
            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: '800', letterSpacing: '-2.5px',
              color: '#fff', margin: '0 0 20px', lineHeight: 1.05,
            }}>
              Your canvas.{' '}
              <span style={{ color: '#6366f1' }}>Your mentor.</span>
            </h1>
            <p style={{
              color: '#71717a', fontSize: 'clamp(15px, 2vw, 18px)',
              lineHeight: '1.7', margin: '0 0 48px', maxWidth: '600px',
            }}>
              Select any area on your canvas and chat with an AI that understands exactly what you're thinking. Like having a mentor who sees your work.
            </p>
          </div>

          {/* SVG Mockup */}
          <div className="aim-mockup" style={{
            marginBottom: '52px',
            padding: '4px',
            borderRadius: '16px',
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            boxShadow: '0 0 60px rgba(99,102,241,0.08)',
          }}>
            <CanvasMockup />
          </div>

          {/* Waitlist form */}
          <div className="aim-form" style={{ width: '100%', maxWidth: '480px' }}>
            {status === 'success' ? (
              <div style={{
                padding: '24px', borderRadius: '14px',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.25)',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: '0 auto 8px', display: 'block' }}>
                    <circle cx="16" cy="16" r="15" stroke="#6366f1" strokeWidth="2" fill="rgba(99,102,241,0.1)"/>
                    <path d="M10 16 L14 20 L22 12" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={{ color: '#fff', fontWeight: '600', fontSize: '16px', margin: '0 0 6px' }}>You're on the list.</p>
                <p style={{ color: '#52525b', fontSize: '13px', margin: 0 }}>We'll reach out when AI Mentor launches.</p>
              </div>
            ) : (
              <>
                <label style={{ display: 'block', color: '#52525b', fontSize: '13px', marginBottom: '12px' }}>
                  Enter your email to join the waitlist
                </label>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                  <input
                    ref={inputRef}
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle') }}
                    className="aim-input"
                  />
                  <button type="submit" disabled={status === 'loading'} className="aim-btn">
                    {status === 'loading' ? 'Joining…' : 'Join waitlist'}
                  </button>
                </form>
                {status === 'duplicate' && (
                  <p style={{ color: '#a78bfa', fontSize: '13px', margin: '0 0 8px' }}>You're already on the waitlist.</p>
                )}
                {status === 'error' && (
                  <p style={{ color: '#f87171', fontSize: '13px', margin: '0 0 8px' }}>Something went wrong. Try again.</p>
                )}
                <p style={{ color: '#3f3f46', fontSize: '12px', margin: 0 }}>
                  Be the first to know when AI Mentor launches.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
