import { Link } from 'react-router-dom'

const orbs = [
  { size: 500, x: '-8%',  y: '-10%', dur: '22s', delay: '0s',   opacity: 0.07 },
  { size: 350, x: '70%',  y: '60%',  dur: '28s', delay: '-8s',  opacity: 0.06 },
  { size: 250, x: '80%',  y: '-5%',  dur: '18s', delay: '-4s',  opacity: 0.05 },
  { size: 200, x: '10%',  y: '70%',  dur: '24s', delay: '-12s', opacity: 0.05 },
  { size: 150, x: '45%',  y: '80%',  dur: '20s', delay: '-6s',  opacity: 0.04 },
]

// Excalidraw-style sketch paths: arrows, boxes, squiggles
const strokes = [
  // big bounding rectangle (sketch-style, slightly off)
  { d: 'M 80 120 L 82 440 L 480 436 L 478 118 Z',                           dur: '6s',   delay: '0.5s',   len: 1400 },
  // arrow pointing right
  { d: 'M 560 200 L 760 200 M 740 182 L 762 200 L 740 218',                 dur: '3.5s', delay: '1.8s',   len: 280  },
  // wavy line
  { d: 'M 820 300 Q 900 240 980 300 Q 1060 360 1140 300',                   dur: '4s',   delay: '3s',     len: 400  },
  // small box top right
  { d: 'M 960 80 L 958 200 L 1100 202 L 1102 78 Z',                         dur: '4s',   delay: '2s',     len: 600  },
  // curved arrow bottom left
  { d: 'M 100 620 Q 200 560 300 620 M 278 604 L 302 622 L 282 642',         dur: '4.5s', delay: '4s',     len: 380  },
  // diagonal line mid
  { d: 'M 500 480 L 700 580',                                                dur: '2.5s', delay: '5s',     len: 240  },
  // squiggle bottom
  { d: 'M 60 780 Q 160 740 260 780 Q 360 820 460 780 Q 560 740 660 780',    dur: '5s',   delay: '2.5s',   len: 700  },
  // circle (hand-drawn arc)
  { d: 'M 780 560 Q 830 510 880 560 Q 930 610 880 660 Q 830 710 780 660 Q 730 610 780 560', dur: '5s', delay: '1s', len: 600 },
  // arrow up left area
  { d: 'M 220 520 L 220 380 M 202 402 L 220 378 L 238 402',                  dur: '3s',   delay: '6s',     len: 200  },
  // small cross / plus
  { d: 'M 1050 480 L 1050 560 M 1010 520 L 1090 520',                        dur: '2s',   delay: '7s',     len: 160  },
  // long baseline
  { d: 'M 40 860 L 1060 860',                                                 dur: '4s',   delay: '3.5s',   len: 1040 },
]

const wordmark = 'Clarito'.split('')

export default function Landing() {
  return (
    <>
      <style>{`
        @keyframes orbDrift {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(50px, -40px) scale(1.06); }
          66%  { transform: translate(-30px, 25px) scale(0.96); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes strokeDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes letterIn {
          from { opacity: 0; transform: translateY(18px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);   filter: blur(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        .land-letter {
          display: inline-block;
          opacity: 0;
          animation: letterIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .land-tagline {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 1.2s forwards;
        }
        .land-sub {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 1.55s forwards;
        }
        .land-btns {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 1.85s forwards;
        }
        .land-footer {
          opacity: 0;
          animation: fadeIn 1.2s ease 2.4s forwards;
        }
        .land-stroke {
          animation: strokeDraw linear forwards;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          padding: 13px 32px;
          background: #6366f1;
          color: #fff;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          font-family: system-ui, sans-serif;
          transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
          letter-spacing: -0.2px;
        }
        .btn-primary:hover {
          background: #4f46e5;
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 32px rgba(99,102,241,0.5);
        }
        .btn-primary:active { transform: scale(0.98); }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 13px 32px;
          background: transparent;
          color: #a5b4fc;
          border: 1.5px solid rgba(99,102,241,0.4);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          font-family: system-ui, sans-serif;
          transition: border-color 0.18s, color 0.18s, transform 0.18s, box-shadow 0.18s, background 0.18s;
          letter-spacing: -0.2px;
        }
        .btn-ghost:hover {
          border-color: rgba(99,102,241,0.8);
          color: #fff;
          background: rgba(99,102,241,0.08);
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 32px rgba(99,102,241,0.2);
        }
        .btn-ghost:active { transform: scale(0.98); }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        {/* Floating orbs */}
        {orbs.map((orb, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: orb.x, top: orb.y,
            width: orb.size, height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(99,102,241,${orb.opacity}) 0%, transparent 70%)`,
            filter: 'blur(60px)',
            animation: `orbDrift ${orb.dur} ease-in-out ${orb.delay} infinite`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Sketch strokes background */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 1200 900"
          preserveAspectRatio="xMidYMid slice"
        >
          {strokes.map((s, i) => (
            <path
              key={i}
              d={s.d}
              stroke="#6366f1"
              strokeOpacity="0.09"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="land-stroke"
              style={{
                strokeDasharray: s.len,
                strokeDashoffset: s.len,
                animationDuration: s.dur,
                animationDelay: s.delay,
              }}
            />
          ))}
        </svg>

        {/* Hero content */}
        <div style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          padding: '0 24px',
        }}>

          {/* Animated wordmark */}
          <div style={{
            fontSize: 'clamp(72px, 12vw, 120px)',
            fontWeight: '800',
            color: '#6366f1',
            letterSpacing: '-4px',
            lineHeight: 1,
            marginBottom: '24px',
            userSelect: 'none',
          }}>
            {wordmark.map((letter, i) => (
              <span
                key={i}
                className="land-letter"
                style={{ animationDelay: `${0.08 * i + 0.1}s` }}
              >
                {letter}
              </span>
            ))}
          </div>

          {/* Tagline */}
          <p className="land-tagline" style={{
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            color: '#a1a1aa',
            fontWeight: '500',
            margin: '0 0 10px',
            letterSpacing: '-0.3px',
          }}>
            Visual canvas for chapter-based learning
          </p>

          {/* Subtitle */}
          <p className="land-sub" style={{
            fontSize: 'clamp(13px, 1.8vw, 15px)',
            color: '#52525b',
            margin: '0 0 44px',
            letterSpacing: '0.2px',
          }}>
            Trace your thinking. Chapter by chapter.
          </p>

          {/* Buttons */}
          <div className="land-btns" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/login" className="btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn-ghost">
              Register
            </Link>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="land-footer" style={{
          position: 'absolute',
          bottom: '32px',
          left: 0, right: 0,
          textAlign: 'center',
        }}>
          <span style={{
            color: '#3f3f46',
            fontSize: '13px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            fontWeight: '500',
          }}>
            Where understanding clicks
          </span>
        </div>
      </div>
    </>
  )
}
