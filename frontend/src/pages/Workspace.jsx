import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'

const strokes = [
  { d: 'M -60 200 Q 250 80 580 220 T 1200 360',  dur: '4s',   delay: '0.3s'  },
  { d: 'M 80 520 Q 360 420 640 500 Q 900 580 1100 480', dur: '3.5s', delay: '1.1s' },
  { d: 'M 0 720 L 1000 720',                       dur: '3s',   delay: '1.9s'  },
  { d: 'M 180 100 L 460 100 L 460 280 L 180 280 Z',dur: '3.5s', delay: '2.7s'  },
  { d: 'M 750 560 Q 870 490 950 590 Q 1020 680 900 720', dur: '4s', delay: '3.3s' },
  { d: 'M 40 840 Q 320 790 600 840 T 1100 820',   dur: '3s',   delay: '4s'    },
  { d: 'M 860 60 Q 960 150 930 270 Q 900 390 1000 450', dur: '3.5s', delay: '1.6s' },
  { d: 'M 40 440 L 200 370 L 360 410 L 520 330',  dur: '2.8s', delay: '4.4s'  },
]

function DrawingIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M2 13 Q5 9 8 11 Q11 13 14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="14" cy="6" r="1.2" fill="currentColor"/>
      <path d="M2 15 L15 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.4"/>
    </svg>
  )
}

function ThreeDots() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="3"  cy="8" r="1.4" fill="currentColor"/>
      <circle cx="8"  cy="8" r="1.4" fill="currentColor"/>
      <circle cx="13" cy="8" r="1.4" fill="currentColor"/>
    </svg>
  )
}

function Modal({ onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    await onCreate(title.trim())
    setLoading(false)
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      onKeyDown={e => { if (e.key === 'Escape') onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        animation: 'ws-modalBgIn 0.2s ease both',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '420px', margin: '24px',
        background: 'rgba(18,18,18,0.95)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '18px', padding: '36px 32px',
        boxShadow: '0 0 48px rgba(99,102,241,0.12), 0 24px 64px rgba(0,0,0,0.6)',
        animation: 'ws-modalCardIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: '0 0 6px' }}>New chapter</h3>
        <p style={{ color: '#52525b', fontSize: '13px', margin: '0 0 24px' }}>Name your chapter to begin.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="e.g. Introduction, Chapter 3…"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px',
              background: 'rgba(255,255,255,0.04)', color: '#fff',
              border: '1px solid rgba(99,102,241,0.25)', borderRadius: '10px',
              fontSize: '14px', boxSizing: 'border-box', outline: 'none',
              fontFamily: 'system-ui, sans-serif',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.18)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(99,102,241,0.25)'; e.target.style.boxShadow = 'none' }}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button type="button" onClick={onClose}
              style={{
                flex: 1, padding: '11px', background: 'transparent',
                color: '#71717a', border: '1px solid #27272a',
                borderRadius: '10px', fontSize: '14px', fontWeight: '500',
                cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#3f3f46'; e.target.style.color = '#a1a1aa' }}
              onMouseLeave={e => { e.target.style.borderColor = '#27272a'; e.target.style.color = '#71717a' }}
            >Cancel</button>
            <button type="submit" disabled={loading || !title.trim()}
              style={{
                flex: 1, padding: '11px', background: '#6366f1', color: '#fff',
                border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !title.trim() ? 0.5 : 1,
                fontFamily: 'system-ui, sans-serif',
                transition: 'background 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { if (!loading && title.trim()) { e.target.style.background = '#4f46e5'; e.target.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)' } }}
              onMouseLeave={e => { e.target.style.background = '#6366f1'; e.target.style.boxShadow = 'none' }}
            >{loading ? 'Creating…' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ChapterCard({ chapter, onOpen, onDelete, index }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleDelete = async e => {
    e.stopPropagation()
    setMenuOpen(false)
    setDeleting(true)
    await onDelete(chapter.id)
  }

  const fmt = iso => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div
      style={{
        background: '#141414', border: '1px solid #1f1f1f',
        borderRadius: '14px', padding: '20px',
        cursor: 'pointer', position: 'relative',
        opacity: deleting ? 0.4 : 1,
        animation: `ws-cardIn 0.5s cubic-bezier(0.22,1,0.36,1) ${0.05 * index + 0.2}s both`,
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}
      onClick={() => !deleting && onOpen(chapter.id)}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1f1f1f'
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{ color: '#fff', fontSize: '15px', fontWeight: '600', lineHeight: 1.3, flex: 1 }}>
          {chapter.title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ color: '#3f3f46' }}><DrawingIcon /></span>
          {/* Three-dot menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
              style={{
                background: 'none', border: 'none', padding: '2px 4px',
                color: '#3f3f46', cursor: 'pointer', borderRadius: '6px',
                display: 'flex', alignItems: 'center',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#3f3f46'; e.currentTarget.style.background = 'none' }}
            >
              <ThreeDots />
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 20,
                background: '#1a1a1a', border: '1px solid #27272a',
                borderRadius: '10px', padding: '4px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                minWidth: '130px',
                animation: 'ws-menuIn 0.15s ease both',
              }}>
                <button
                  onClick={handleDelete}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'none',
                    color: '#f87171', border: 'none', borderRadius: '7px',
                    fontSize: '13px', cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'system-ui, sans-serif',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  Delete chapter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <span style={{ color: '#52525b', fontSize: '12px' }}>
        Created {fmt(chapter.created_at)}
      </span>
    </div>
  )
}

export default function Workspace() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([api.get(`/workspaces/${id}`), api.get(`/chapters/?workspace_id=${id}`)])
      .then(([wsRes, chapRes]) => {
        setWorkspace(wsRes.data)
        setChapters(chapRes.data)
        setLoaded(true)
      })
      .catch(() => navigate('/dashboard'))
  }, [id, navigate])

  const createChapter = async title => {
    const { data } = await api.post('/chapters/', { title, workspace_id: id, canvas_data: {} })
    setChapters(cs => [data, ...cs])
    setShowModal(false)
  }

  const deleteChapter = async chapterId => {
    await api.delete(`/chapters/${chapterId}`)
    setChapters(cs => cs.filter(c => c.id !== chapterId))
  }

  return (
    <>
      <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes ws-navIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ws-pageIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ws-cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ws-modalBgIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ws-modalCardIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ws-menuIn {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ws-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes ws-skeletonIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ws-penBob {
          0%, 100% { transform: translate(0, 0) rotate(-20deg); }
          50%       { transform: translate(6px, -6px) rotate(-14deg); }
        }
        @keyframes ws-trailGrow {
          0%   { stroke-dashoffset: 120; opacity: 0.2; }
          50%  { stroke-dashoffset: 0;   opacity: 0.7; }
          100% { stroke-dashoffset: 120; opacity: 0.2; }
        }
        .ws-skel {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.03) 0%,
            rgba(99,102,241,0.08) 40%,
            rgba(255,255,255,0.03) 80%
          );
          background-size: 600px 100%;
          animation: ws-shimmer 1.8s ease-in-out infinite;
          border-radius: 7px;
        }
        .ws-stroke {
          stroke-dasharray: 1600;
          stroke-dashoffset: 1600;
          animation: draw linear forwards;
        }
        .ws-new-btn {
          padding: 9px 18px; background: #6366f1; color: #fff;
          border: none; border-radius: 9px; font-size: 13.5px; font-weight: 600;
          cursor: pointer; font-family: system-ui, sans-serif;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .ws-new-btn:hover { background: #4f46e5; transform: scale(1.03); box-shadow: 0 4px 18px rgba(99,102,241,0.4); }
        .ws-back-btn {
          padding: 9px 16px; background: transparent; color: #52525b;
          border: 1px solid #27272a; border-radius: 9px; font-size: 13.5px;
          cursor: pointer; font-family: system-ui, sans-serif;
          transition: color 0.15s, border-color 0.15s; text-decoration: none;
          display: inline-flex; align-items: center;
        }
        .ws-back-btn:hover { color: #a1a1aa; border-color: #3f3f46; }
        .ws-empty-btn {
          margin-top: 20px; padding: 13px 28px; background: #6366f1; color: #fff;
          border: none; border-radius: 10px; font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: system-ui, sans-serif;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .ws-empty-btn:hover { background: #4f46e5; transform: scale(1.03); box-shadow: 0 6px 24px rgba(99,102,241,0.45); }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0f0f0f', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>

        {/* Background strokes */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 1100 900" preserveAspectRatio="xMidYMid slice">
          {strokes.map((s, i) => (
            <path key={i} d={s.d}
              stroke="#6366f1" strokeOpacity="0.07" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" fill="none"
              className="ws-stroke"
              style={{ animationDuration: s.dur, animationDelay: s.delay }}
            />
          ))}
        </svg>

        {/* Navbar */}
        <nav style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: '60px', background: '#0f0f0f',
          borderBottom: '1px solid rgba(99,102,241,0.15)',
          animation: 'ws-navIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both',
        }}>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#6366f1', letterSpacing: '-1px' }}>
            Clarito
          </span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="ws-new-btn" onClick={() => setShowModal(true)}>
              + New chapter
            </button>
            <button className="ws-back-btn" onClick={() => navigate('/dashboard')}>
              ← Workspaces
            </button>
            <button className="ws-back-btn" onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>
              Logout
            </button>
          </div>
        </nav>

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 10,
          maxWidth: '1100px', margin: '0 auto', padding: '40px 32px',
          animation: 'ws-pageIn 0.5s ease 0.15s both',
        }}>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', margin: '0 0 28px', letterSpacing: '-0.5px' }}>
            {workspace?.name ?? '…'}
          </h1>

          {!loaded ? (
            <div style={{ animation: 'ws-skeletonIn 0.4s ease both' }}>
              {/* Animated pen + trail */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                  style={{ animation: 'ws-penBob 1.4s ease-in-out infinite', flexShrink: 0 }}>
                  <path d="M6 22 L10 10 L20 6 L22 8 L12 20 Z"
                    fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="1.4"
                    strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 22 L10 18" stroke="#6366f1" strokeWidth="1.4" strokeLinecap="round"/>
                  <path className="ws-skel" d="M6 22 Q14 20 22 14"
                    stroke="none" fill="none"
                    style={{ background: 'none' }}/>
                  <path d="M6 22 Q14 20 22 14"
                    stroke="#6366f1" strokeWidth="1.4" strokeLinecap="round"
                    strokeDasharray="120" fill="none"
                    style={{ animation: 'ws-trailGrow 1.4s ease-in-out infinite' }}/>
                </svg>
                <span style={{ color: '#3f3f46', fontSize: '13.5px', fontWeight: '500', letterSpacing: '0.2px' }}>
                  Loading chapters…
                </span>
              </div>

              {/* Skeleton card grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
              }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    background: '#141414',
                    border: '1px solid #1f1f1f',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex', flexDirection: 'column', gap: '14px',
                    animation: `ws-skeletonIn 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s both`,
                  }}>
                    {/* Top row: title + icon */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <div className="ws-skel" style={{ height: '14px', borderRadius: '7px', flex: 1, maxWidth: `${55 + (i % 3) * 15}%` }} />
                      <div className="ws-skel" style={{ width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0 }} />
                    </div>
                    {/* Optional second line — alternating */}
                    {i % 2 === 0 && (
                      <div className="ws-skel" style={{ height: '11px', borderRadius: '6px', width: '40%' }} />
                    )}
                    {/* Date line */}
                    <div className="ws-skel" style={{ height: '10px', borderRadius: '6px', width: '30%', marginTop: '2px' }} />
                  </div>
                ))}
              </div>
            </div>
          ) : chapters.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '80px' }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ margin: '0 auto 20px', display: 'block' }}>
                <rect x="8" y="8" width="56" height="42" rx="6" stroke="#6366f1" strokeOpacity="0.3" strokeWidth="2"/>
                <path d="M20 30 Q28 22 36 28 Q44 34 52 24" stroke="#6366f1" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M12 58 L60 58" stroke="#6366f1" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 64 L52 64" stroke="#6366f1" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p style={{ color: '#52525b', fontSize: '16px', margin: '0 0 6px' }}>No chapters yet</p>
              <p style={{ color: '#3f3f46', fontSize: '14px', margin: 0 }}>Start your first one.</p>
              <button className="ws-empty-btn" onClick={() => setShowModal(true)}>
                + New chapter
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {chapters.map((ch, i) => (
                <ChapterCard
                  key={ch.id}
                  chapter={ch}
                  index={i}
                  onOpen={chId => navigate(`/canvas/${chId}`, { state: { chapter: chapters.find(c => c.id === chId) } })}
                  onDelete={deleteChapter}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)} onCreate={createChapter} />
      )}
    </>
  )
}
