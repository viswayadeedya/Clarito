import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useScroll, useMotionValueEvent } from 'framer-motion'

const TOTAL_FRAMES = 120

function pad(n) {
  return String(n).padStart(3, '0')
}

function frameSrc(i) {
  return `/frames/frame_${pad(i)}_delay-0.066s.png`
}

// ─── Floating Navbar ────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '60px',
      background: 'rgba(15,15,15,0.55)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <span style={{ fontSize: '21px', fontWeight: '800', color: '#fff', letterSpacing: '-1px' }}>
        Clarito
      </span>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to="/login" style={{
          padding: '8px 18px',
          background: 'transparent',
          color: '#a1a1aa',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '9px',
          fontSize: '13.5px', fontWeight: '500',
          textDecoration: 'none',
          fontFamily: 'system-ui, sans-serif',
          transition: 'color 0.15s, border-color 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
        >
          Login
        </Link>
        <Link to="/register" style={{
          padding: '8px 18px',
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: '9px',
          fontSize: '13.5px', fontWeight: '600',
          textDecoration: 'none',
          fontFamily: 'system-ui, sans-serif',
          transition: 'background 0.15s, box-shadow 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(99,102,241,0.45)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.boxShadow = 'none' }}
        >
          Get started
        </Link>
      </div>
    </nav>
  )
}

// ─── Scroll Sequence Hero ────────────────────────────────────────────────────
function ScrollHero() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const frameRef = useRef(0)
  const imagesRef = useRef([])

  // Text overlay refs
  const text1Ref = useRef(null)
  const text2Ref = useRef(null)
  const text3Ref = useRef(null)
  const ctaRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // Preload all frames
  useEffect(() => {
    imagesRef.current = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const img = new Image()
      img.src = frameSrc(i)
      return img
    })
  }, [])

  // Draw current frame on canvas
  function drawFrame(index) {
    const img = imagesRef.current[index]
    const canvas = canvasRef.current
    if (!canvas || !img?.complete || !img.naturalWidth) return
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight)
    const sw = img.naturalWidth * scale
    const sh = img.naturalHeight * scale
    const sx = (width - sw) / 2
    const sy = (height - sh) / 2
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(img, sx, sy, sw, sh)
  }

  // Resize canvas to window
  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawFrame(frameRef.current)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Helper: opacity + translateY for a text block
  function textStyle(progress, inStart, holdEnd, outEnd, direction = 'up') {
    const sign = direction === 'up' ? -1 : 1
    if (progress < inStart) {
      const t = Math.max(0, (progress - (inStart - 0.04)) / 0.04)
      return { opacity: t, transform: `translateY(${(1 - t) * 20}px)` }
    }
    if (progress <= holdEnd) {
      return { opacity: 1, transform: 'translateY(0px)' }
    }
    if (progress <= outEnd) {
      const t = (progress - holdEnd) / (outEnd - holdEnd)
      return { opacity: 1 - t, transform: `translateY(${sign * t * 20}px)` }
    }
    return { opacity: 0, transform: `translateY(${sign * 20}px)` }
  }

  useMotionValueEvent(scrollYProgress, 'change', progress => {
    // Update frame
    const idx = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1)
    if (idx !== frameRef.current) {
      frameRef.current = idx
      const img = imagesRef.current[idx]
      if (img?.complete && img.naturalWidth) {
        drawFrame(idx)
      } else if (img) {
        img.onload = () => drawFrame(idx)
      }
    }

    // Text 1: 0% → 15%  "Where understanding clicks"
    const s1 = textStyle(progress, 0.0, 0.12, 0.15)
    if (text1Ref.current) {
      text1Ref.current.style.opacity = s1.opacity
      text1Ref.current.style.transform = s1.transform
    }

    // Text 2: 20% → 45%  "Sketch your thinking..."
    const s2 = textStyle(progress, 0.20, 0.38, 0.45)
    if (text2Ref.current) {
      text2Ref.current.style.opacity = s2.opacity
      text2Ref.current.style.transform = s2.transform
    }

    // Text 3: 50% → 75%  "Organized by chapters..."
    const s3 = textStyle(progress, 0.50, 0.68, 0.75)
    if (text3Ref.current) {
      text3Ref.current.style.opacity = s3.opacity
      text3Ref.current.style.transform = s3.transform
    }

    // CTA: 80% → stays
    const tCta = Math.max(0, Math.min(1, (progress - 0.80) / 0.06))
    if (ctaRef.current) {
      ctaRef.current.style.opacity = tCta
      ctaRef.current.style.transform = `translateY(${(1 - tCta) * 20}px)`
    }
  })

  return (
    <div ref={containerRef} style={{ height: '600vh', position: 'relative' }}>
      {/* Sticky viewport */}
      <div style={{
        position: 'sticky', top: 0,
        width: '100vw', height: '100vh',
        overflow: 'hidden', background: '#000',
      }}>
        {/* Frame canvas */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

        {/* Dark overlay for text readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', pointerEvents: 'none' }} />

        {/* Text 1 — centered */}
        <div ref={text1Ref} style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, transition: 'none', pointerEvents: 'none',
        }}>
          <h1 style={{
            color: '#fff', fontSize: 'clamp(32px, 5vw, 68px)',
            fontWeight: '800', letterSpacing: '-2px',
            textAlign: 'center', margin: 0,
            fontFamily: 'system-ui, sans-serif',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
          }}>
            Where understanding clicks
          </h1>
        </div>

        {/* Text 2 — left */}
        <div ref={text2Ref} style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
          padding: '0 8vw',
          opacity: 0, pointerEvents: 'none',
        }}>
          <h2 style={{
            color: '#fff', fontSize: 'clamp(24px, 3.5vw, 52px)',
            fontWeight: '700', letterSpacing: '-1.5px',
            margin: 0, maxWidth: '600px',
            fontFamily: 'system-ui, sans-serif',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
          }}>
            Sketch your thinking.<br />Connect your ideas.
          </h2>
        </div>

        {/* Text 3 — right */}
        <div ref={text3Ref} style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 8vw',
          opacity: 0, pointerEvents: 'none',
        }}>
          <h2 style={{
            color: '#fff', fontSize: 'clamp(24px, 3.5vw, 52px)',
            fontWeight: '700', letterSpacing: '-1.5px',
            margin: 0, maxWidth: '600px', textAlign: 'right',
            fontFamily: 'system-ui, sans-serif',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
          }}>
            Organized by chapters.<br />Always in context.
          </h2>
        </div>

        {/* CTA */}
        <div ref={ctaRef} style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '24px',
          opacity: 0,
        }}>
          <h2 style={{
            color: '#fff', fontSize: 'clamp(28px, 4vw, 58px)',
            fontWeight: '800', letterSpacing: '-2px',
            margin: 0, textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
          }}>
            Start your first canvas.<br />
            <span style={{ color: '#818cf8' }}>Free.</span>
          </h2>
          <Link to="/register" style={{
            padding: '15px 36px',
            background: '#6366f1', color: '#fff',
            borderRadius: '12px', fontSize: '16px', fontWeight: '700',
            textDecoration: 'none', fontFamily: 'system-ui, sans-serif',
            boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
            transition: 'background 0.15s, transform 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Below-fold sections ─────────────────────────────────────────────────────
function PainPoint({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#6366f1',
      }}>
        {icon}
      </div>
      <p style={{ color: '#71717a', fontSize: '15px', lineHeight: '1.6', margin: '6px 0 0', fontFamily: 'system-ui, sans-serif' }}>
        {text}
      </p>
    </div>
  )
}

function FeatureCard({ title, desc }) {
  return (
    <div style={{
      background: '#141414', border: '1px solid #1f1f1f',
      borderRadius: '16px', padding: '28px 24px',
      transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1f1f1f'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: '700', margin: '0 0 10px', fontFamily: 'system-ui, sans-serif' }}>
        {title}
      </h3>
      <p style={{ color: '#52525b', fontSize: '14px', lineHeight: '1.65', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {desc}
      </p>
    </div>
  )
}

export default function Landing() {
  return (
    <div style={{ background: '#0f0f0f', color: '#fff' }}>
      <Navbar />
      <ScrollHero />

      {/* Section 1 — Problem */}
      <section style={{ background: '#0f0f0f', padding: '100px 32px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: '800',
            letterSpacing: '-1.5px', margin: '0 0 48px',
            fontFamily: 'system-ui, sans-serif', color: '#fff',
          }}>
            Notes don't work<br />for visual thinkers.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <PainPoint
              icon={
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <line x1="3" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  <line x1="3" y1="9" x2="11" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  <line x1="3" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              }
              text="Bullet points miss the connections. Ideas don't live in lists — they live in relationships."
            />
            <PainPoint
              icon={
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 15 L9 3 L15 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="5.5" y1="11" x2="12.5" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              }
              text="Linear notes kill nonlinear thinking. Your brain doesn't work top-to-bottom — your tools shouldn't either."
            />
            <PainPoint
              icon={
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M9 5 L9 9 L12 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              text="You understand it until you close the tab. Without a visual anchor, context vanishes overnight."
            />
          </div>
        </div>
      </section>

      {/* Section 2 — Features */}
      <section style={{ background: '#080808', padding: '100px 32px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: '800',
            letterSpacing: '-1.5px', margin: '0 0 48px', textAlign: 'center',
            fontFamily: 'system-ui, sans-serif', color: '#fff',
          }}>
            Built for the way you actually think
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}>
            <FeatureCard
              title="Canvas that thinks like you"
              desc="Draw, connect, annotate — freely. No templates, no constraints. Just a blank canvas ready for your ideas."
            />
            <FeatureCard
              title="Chapter organization"
              desc="Every topic gets its own space. Switch between chapters without losing context. Everything stays where you left it."
            />
            <FeatureCard
              title="Auto-saves everything"
              desc="Your work saves every few seconds without you thinking about it. Close the tab. Come back. It's all there."
            />
          </div>
        </div>
      </section>

      {/* Section 3 — Final CTA */}
      <section style={{ background: '#0f0f0f', padding: '120px 32px', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '800',
          letterSpacing: '-2px', margin: '0 0 12px',
          fontFamily: 'system-ui, sans-serif', color: '#fff',
        }}>
          Start your first canvas.{' '}
          <span style={{ color: '#6366f1' }}>Free.</span>
        </h2>
        <p style={{ color: '#3f3f46', fontSize: '14px', margin: '0 0 36px', fontFamily: 'system-ui, sans-serif' }}>
          No credit card required
        </p>
        <Link to="/register" style={{
          display: 'inline-block',
          padding: '15px 40px',
          background: '#6366f1', color: '#fff',
          borderRadius: '12px', fontSize: '16px', fontWeight: '700',
          textDecoration: 'none', fontFamily: 'system-ui, sans-serif',
          transition: 'background 0.15s, transform 0.15s, box-shadow 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.45)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          Get started
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#080808',
        borderTop: '1px solid #141414',
        padding: '28px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <span style={{ fontSize: '18px', fontWeight: '800', color: '#6366f1', letterSpacing: '-1px', fontFamily: 'system-ui, sans-serif' }}>
          Clarito
        </span>
        <span style={{ color: '#3f3f46', fontSize: '13px', fontFamily: 'system-ui, sans-serif' }}>
          © 2026 Clarito. All rights reserved.
        </span>
      </footer>
    </div>
  )
}
