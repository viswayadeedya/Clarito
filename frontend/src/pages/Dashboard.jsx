import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

const strokes = [
  { d: 'M -40 180 Q 200 80 500 200 T 1100 320',  dur: '4s',   delay: '0.2s'  },
  { d: 'M 100 500 Q 350 400 600 480 Q 850 560 1000 460', dur: '3.5s', delay: '1s'   },
  { d: 'M 0 700 L 900 700',                        dur: '3s',   delay: '1.8s'  },
  { d: 'M 200 120 L 480 120 L 480 300 L 200 300 Z',dur: '3.5s', delay: '2.6s'  },
  { d: 'M 700 550 Q 820 480 900 580 Q 980 680 860 720 Q 740 760 720 660', dur: '4s', delay: '3.2s' },
  { d: 'M 50 820 Q 300 770 550 820 T 1050 800',   dur: '3s',   delay: '3.8s'  },
  { d: 'M 820 80 Q 920 160 890 280 Q 860 400 960 460', dur: '3.5s', delay: '1.5s' },
  { d: 'M 60 400 L 180 340 L 320 380 L 480 300',  dur: '2.8s', delay: '4.2s'  },
]

function CanvasIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="11" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="1" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}

function ThreeDots() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
      <circle cx="7.5" cy="2.5" r="1.4"/>
      <circle cx="7.5" cy="7.5" r="1.4"/>
      <circle cx="7.5" cy="12.5" r="1.4"/>
    </svg>
  )
}

function Modal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleKey = e => { if (e.key === 'Escape') onClose() }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await onCreate(name.trim())
    setLoading(false)
  }

  return (
    <div
      onKeyDown={handleKey}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        animation: 'modalBgIn 0.2s ease both',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%', maxWidth: '420px', margin: '24px',
        background: 'rgba(18,18,18,0.95)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '18px',
        padding: '36px 32px',
        boxShadow: '0 0 48px rgba(99,102,241,0.12), 0 24px 64px rgba(0,0,0,0.6)',
        animation: 'modalCardIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: '0 0 6px' }}>
          New workspace
        </h3>
        <p style={{ color: '#52525b', fontSize: '13px', margin: '0 0 24px' }}>
          Give your workspace a name to get started.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="e.g. Physics 101, Design Thinking…"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px',
              background: 'rgba(255,255,255,0.04)',
              color: '#fff', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '10px', fontSize: '14px',
              boxSizing: 'border-box', outline: 'none',
              fontFamily: 'system-ui, sans-serif',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#6366f1'
              e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.18)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(99,102,241,0.25)'
              e.target.style.boxShadow = 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '11px',
                background: 'transparent',
                color: '#71717a', border: '1px solid #27272a',
                borderRadius: '10px', fontSize: '14px', fontWeight: '500',
                cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#3f3f46'; e.target.style.color = '#a1a1aa' }}
              onMouseLeave={e => { e.target.style.borderColor = '#27272a'; e.target.style.color = '#71717a' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              style={{
                flex: 1, padding: '11px',
                background: '#6366f1', color: '#fff',
                border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: '600',
                cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !name.trim() ? 0.5 : 1,
                fontFamily: 'system-ui, sans-serif',
                transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { if (!loading && name.trim()) { e.target.style.background = '#4f46e5'; e.target.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)' } }}
              onMouseLeave={e => { e.target.style.background = '#6366f1'; e.target.style.boxShadow = 'none' }}
            >
              {loading ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function RenameModal({ current, label, onClose, onRename }) {
  const [name, setName] = useState(current)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || trimmed === current) { onClose(); return }
    setLoading(true)
    await onRename(trimmed)
    setLoading(false)
  }

  return (
    <div
      onKeyDown={e => { if (e.key === 'Escape') onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        animation: 'modalBgIn 0.2s ease both',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%', maxWidth: '420px', margin: '24px',
        background: 'rgba(18,18,18,0.95)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '18px', padding: '36px 32px',
        boxShadow: '0 0 48px rgba(99,102,241,0.12), 0 24px 64px rgba(0,0,0,0.6)',
        animation: 'modalCardIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: '0 0 6px' }}>
          Rename {label}
        </h3>
        <p style={{ color: '#52525b', fontSize: '13px', margin: '0 0 24px' }}>
          Enter a new name.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
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
                color: '#71717a', border: '1px solid #27272a', borderRadius: '10px',
                fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif', transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#3f3f46'; e.target.style.color = '#a1a1aa' }}
              onMouseLeave={e => { e.target.style.borderColor = '#27272a'; e.target.style.color = '#71717a' }}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading || !name.trim()}
              style={{
                flex: 1, padding: '11px', background: '#6366f1', color: '#fff',
                border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !name.trim() ? 0.5 : 1,
                fontFamily: 'system-ui, sans-serif',
                transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { if (!loading && name.trim()) { e.target.style.background = '#4f46e5'; e.target.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)' } }}
              onMouseLeave={e => { e.target.style.background = '#6366f1'; e.target.style.boxShadow = 'none' }}
            >
              {loading ? 'Renaming…' : 'Rename'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteModal({ workspace, onClose, onConfirm, loading }) {
  const [typed, setTyped] = useState('')
  const inputRef = useRef(null)
  const matches = typed === workspace.name

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleKey = e => { if (e.key === 'Escape') onClose() }

  return (
    <div
      onKeyDown={handleKey}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        animation: 'modalBgIn 0.2s ease both',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%', maxWidth: '440px', margin: '24px',
        background: 'rgba(15,15,15,0.97)',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: '18px',
        padding: '32px',
        boxShadow: '0 0 48px rgba(239,68,68,0.08), 0 24px 64px rgba(0,0,0,0.7)',
        animation: 'modalCardIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        {/* Warning icon */}
        <div style={{ marginBottom: '18px' }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M15.27 5.5L2.77 27a3 3 0 002.6 4.5h25a3 3 0 002.6-4.5L20.73 5.5a3 3 0 00-5.46 0z"
              stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              fill="rgba(239,68,68,0.08)"/>
            <line x1="18" y1="14" x2="18" y2="22" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="18" cy="27" r="1.2" fill="#ef4444"/>
          </svg>
        </div>

        <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: '0 0 12px' }}>
          Delete workspace
        </h3>

        <p style={{ color: '#71717a', fontSize: '13.5px', lineHeight: '1.6', margin: '0 0 20px' }}>
          This action <span style={{ color: '#a1a1aa', fontWeight: '600' }}>cannot be undone</span>. This will permanently delete the{' '}
          <span style={{ color: '#fff', fontWeight: '600' }}>{workspace.name}</span>{' '}
          workspace and all chapters inside it.
        </p>

        <div style={{ marginBottom: '18px' }}>
          <label style={{
            display: 'block', color: '#71717a', fontSize: '12px',
            fontWeight: '500', marginBottom: '8px', lineHeight: '1.5',
          }}>
            Please type{' '}
            <span style={{
              display: 'inline-block', background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px',
              padding: '1px 6px', color: '#fca5a5', fontFamily: 'monospace',
              fontSize: '12px', fontWeight: '600',
            }}>
              {workspace.name}
            </span>
            {' '}to confirm:
          </label>
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={e => setTyped(e.target.value)}
            placeholder={workspace.name}
            style={{
              width: '100%', padding: '10px 13px',
              background: 'rgba(255,255,255,0.03)',
              color: '#fff', outline: 'none',
              border: `1px solid ${matches ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '9px', fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'system-ui, sans-serif',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: matches ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none',
            }}
            onFocus={e => {
              if (!matches) {
                e.target.style.borderColor = 'rgba(239,68,68,0.35)'
                e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.08)'
              }
            }}
            onBlur={e => {
              if (!matches) {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                e.target.style.boxShadow = 'none'
              }
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1, padding: '11px',
              background: 'transparent',
              color: '#71717a', border: '1px solid #27272a',
              borderRadius: '10px', fontSize: '14px', fontWeight: '500',
              cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3f3f46'; e.currentTarget.style.color = '#a1a1aa' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.color = '#71717a' }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!matches || loading}
            onClick={onConfirm}
            style={{
              flex: 1, padding: '11px',
              background: matches ? '#dc2626' : '#27272a',
              color: matches ? '#fff' : '#52525b',
              border: 'none', borderRadius: '10px',
              fontSize: '14px', fontWeight: '600',
              cursor: !matches || loading ? 'not-allowed' : 'pointer',
              fontFamily: 'system-ui, sans-serif',
              transition: 'background 0.2s, color 0.2s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { if (matches && !loading) e.currentTarget.style.boxShadow = '0 4px 20px rgba(220,38,38,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
          >
            {loading ? 'Deleting…' : 'Delete workspace'}
          </button>
        </div>
      </div>
    </div>
  )
}

function WorkspaceCard({ ws, index, onNavigate, onDeleteClick, onRenameClick, isMenuOpen, onMenuToggle, isFading }) {
  const menuRef = useRef(null)

  return (
    <div
      className="ws-card"
      onClick={onNavigate}
      style={{
        animation: `cardIn 0.5s cubic-bezier(0.22,1,0.36,1) ${0.05 * index + 0.2}s both`,
        opacity: isFading ? 0.4 : 1,
        transition: isFading ? 'opacity 0.3s ease' : undefined,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ color: '#fff', fontSize: '15px', fontWeight: '600', lineHeight: 1.3 }}>
          {ws.name}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
          {/* Three-dot menu */}
          <div ref={menuRef} className="ws-menu-container" style={{ position: 'relative' }}>
            <button
              className="ws-dots-btn"
              onClick={e => { e.stopPropagation(); onMenuToggle() }}
              title="Options"
              style={{
                background: 'transparent', border: 'none',
                color: '#52525b', cursor: 'pointer', padding: '2px 4px',
                borderRadius: '6px', lineHeight: 0,
                transition: 'color 0.15s, background 0.15s',
                fontFamily: 'system-ui, sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#52525b'; e.currentTarget.style.background = 'transparent' }}
            >
              <ThreeDots />
            </button>

            {isMenuOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                background: '#1a1a1a',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '10px',
                padding: '4px',
                minWidth: '160px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                zIndex: 20,
                animation: 'dropdownIn 0.15s cubic-bezier(0.22,1,0.36,1) both',
              }}>
                <button
                  onClick={e => { e.stopPropagation(); onRenameClick() }}
                  style={{
                    width: '100%', padding: '8px 12px',
                    background: 'transparent', border: 'none',
                    color: '#a1a1aa', fontSize: '13px', fontWeight: '500',
                    cursor: 'pointer', borderRadius: '7px',
                    textAlign: 'left', fontFamily: 'system-ui, sans-serif',
                    transition: 'background 0.12s, color 0.12s',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a1a1aa' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 4l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  Rename
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDeleteClick() }}
                  style={{
                    width: '100%', padding: '8px 12px',
                    background: 'transparent', border: 'none',
                    color: '#f87171', fontSize: '13px', fontWeight: '500',
                    cursor: 'pointer', borderRadius: '7px',
                    textAlign: 'left', fontFamily: 'system-ui, sans-serif',
                    transition: 'background 0.12s, color 0.12s',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#fca5a5' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f87171' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1.5 3.5h11M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M11.5 3.5l-.7 8a1 1 0 01-1 .9H4.2a1 1 0 01-1-.9l-.7-8"
                      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="7" y1="6" x2="7" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <line x1="5" y1="6" x2="5.3" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <line x1="9" y1="6" x2="8.7" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  Delete workspace
                </button>
              </div>
            )}
          </div>

          <span style={{ color: '#3f3f46' }}>
            <CanvasIcon />
          </span>
        </div>
      </div>
      <span style={{ color: '#52525b', fontSize: '12px' }}>
        {new Date(ws.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [fadingIds, setFadingIds] = useState(new Set())
  const [renameTarget, setRenameTarget] = useState(null)

  useEffect(() => {
    api.get('/workspaces/')
      .then(r => { setWorkspaces(r.data); setLoaded(true) })
      .catch(() => { localStorage.removeItem('token'); navigate('/login') })
  }, [navigate])

  // Close menu on outside click
  useEffect(() => {
    if (!openMenuId) return
    const handler = e => {
      if (!e.target.closest('.ws-menu-container')) setOpenMenuId(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openMenuId])

  const createWorkspace = async name => {
    const { data } = await api.post('/workspaces/', { name })
    setWorkspaces(ws => [data, ...ws])
    setShowModal(false)
  }

  const openDeleteModal = ws => {
    setOpenMenuId(null)
    setDeleteTarget(ws)
  }

  const openRenameModal = ws => {
    setOpenMenuId(null)
    setRenameTarget(ws)
  }

  const renameWorkspace = async newName => {
    const { data } = await api.patch(`/workspaces/${renameTarget.id}`, { name: newName })
    setWorkspaces(ws => ws.map(w => w.id === data.id ? data : w))
    setRenameTarget(null)
  }

  const deleteWorkspace = async () => {
    setDeleteLoading(true)
    try {
      await api.delete(`/workspaces/${deleteTarget.id}`)
      setFadingIds(s => new Set([...s, deleteTarget.id]))
      setTimeout(() => {
        setWorkspaces(ws => ws.filter(w => w.id !== deleteTarget.id))
        setFadingIds(s => { const n = new Set(s); n.delete(deleteTarget.id); return n })
      }, 300)
      setDeleteTarget(null)
    } catch {
      // keep modal open on error
    } finally {
      setDeleteLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes navIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pageIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalBgIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalCardIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: scale(0.93) translateY(-6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes db-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes db-skeletonIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes db-penBob {
          0%, 100% { transform: translate(0, 0) rotate(-20deg); }
          50%       { transform: translate(6px, -6px) rotate(-14deg); }
        }
        @keyframes db-trailGrow {
          0%   { stroke-dashoffset: 120; opacity: 0.2; }
          50%  { stroke-dashoffset: 0;   opacity: 0.7; }
          100% { stroke-dashoffset: 120; opacity: 0.2; }
        }
        .db-skel {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.03) 0%,
            rgba(99,102,241,0.08) 40%,
            rgba(255,255,255,0.03) 80%
          );
          background-size: 600px 100%;
          animation: db-shimmer 1.8s ease-in-out infinite;
          border-radius: 7px;
        }
        .db-stroke {
          stroke-dasharray: 1600;
          stroke-dashoffset: 1600;
          animation: draw linear forwards;
        }
        .db-nav { animation: navIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .db-page { animation: pageIn 0.5s ease 0.15s both; }
        .ws-card {
          background: #141414;
          border: 1px solid #1f1f1f;
          border-radius: 14px;
          padding: 22px 20px;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          text-align: left;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          box-sizing: border-box;
        }
        .ws-card:hover {
          border-color: rgba(99,102,241,0.5);
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 8px 32px rgba(99,102,241,0.12);
        }
        .ws-card:hover .ws-dots-btn {
          opacity: 1;
        }
        .ws-dots-btn {
          opacity: 0;
          transition: opacity 0.15s, color 0.15s, background 0.15s !important;
        }
        .db-new-btn {
          padding: 9px 18px;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: system-ui, sans-serif;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .db-new-btn:hover {
          background: #4f46e5;
          transform: scale(1.03);
          box-shadow: 0 4px 18px rgba(99,102,241,0.4);
        }
        .db-logout-btn {
          padding: 9px 16px;
          background: transparent;
          color: #52525b;
          border: 1px solid #27272a;
          border-radius: 9px;
          font-size: 13.5px;
          cursor: pointer;
          font-family: system-ui, sans-serif;
          transition: color 0.15s, border-color 0.15s;
        }
        .db-logout-btn:hover { color: #a1a1aa; border-color: #3f3f46; }
        .db-empty-btn {
          margin-top: 20px;
          padding: 13px 28px;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: system-ui, sans-serif;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .db-empty-btn:hover {
          background: #4f46e5;
          transform: scale(1.03);
          box-shadow: 0 6px 24px rgba(99,102,241,0.45);
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0f0f0f', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>

        {/* Background strokes */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 1100 900" preserveAspectRatio="xMidYMid slice">
          {strokes.map((s, i) => (
            <path key={i} d={s.d}
              stroke="#6366f1" strokeOpacity="0.07" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" fill="none"
              className="db-stroke"
              style={{ animationDuration: s.dur, animationDelay: s.delay }}
            />
          ))}
        </svg>

        {/* Navbar */}
        <nav className="db-nav" style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: '60px',
          background: '#0f0f0f',
          borderBottom: '1px solid rgba(99,102,241,0.15)',
        }}>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#6366f1', letterSpacing: '-1px' }}>
            Clarito
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="db-new-btn" onClick={() => setShowModal(true)}>
              + New workspace
            </button>
            <button className="db-logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </nav>

        {/* Content */}
        <div className="db-page" style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>

          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', margin: '0 0 28px', letterSpacing: '-0.5px' }}>
            Workspaces
          </h1>

          {!loaded ? (
            <div style={{ animation: 'db-skeletonIn 0.4s ease both' }}>
              {/* Animated pen + trail */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                  style={{ animation: 'db-penBob 1.4s ease-in-out infinite', flexShrink: 0 }}>
                  <path d="M6 22 L10 10 L20 6 L22 8 L12 20 Z"
                    fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="1.4"
                    strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 22 L10 18" stroke="#6366f1" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M6 22 Q14 20 22 14"
                    stroke="#6366f1" strokeWidth="1.4" strokeLinecap="round"
                    strokeDasharray="120" fill="none"
                    style={{ animation: 'db-trailGrow 1.4s ease-in-out infinite' }}/>
                </svg>
                <span style={{ color: '#3f3f46', fontSize: '13.5px', fontWeight: '500', letterSpacing: '0.2px' }}>
                  Loading workspaces…
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
                    padding: '22px 20px',
                    display: 'flex', flexDirection: 'column', gap: '14px',
                    animation: `db-skeletonIn 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s both`,
                  }}>
                    {/* Top row: title + icon */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <div className="db-skel" style={{ height: '14px', borderRadius: '7px', flex: 1, maxWidth: `${55 + (i % 3) * 15}%` }} />
                      <div className="db-skel" style={{ width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0 }} />
                    </div>
                    {/* Optional mid line */}
                    {i % 2 === 0 && (
                      <div className="db-skel" style={{ height: '11px', borderRadius: '6px', width: '40%' }} />
                    )}
                    {/* Date line */}
                    <div className="db-skel" style={{ height: '10px', borderRadius: '6px', width: '30%', marginTop: '2px' }} />
                  </div>
                ))}
              </div>
            </div>
          ) : workspaces.length === 0 ? (
            /* Empty state */
            <div style={{ textAlign: 'center', paddingTop: '80px' }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ margin: '0 auto 20px' }}>
                <rect x="8"  y="8"  width="24" height="24" rx="5" stroke="#6366f1" strokeOpacity="0.3" strokeWidth="2"/>
                <rect x="40" y="8"  width="24" height="24" rx="5" stroke="#6366f1" strokeOpacity="0.3" strokeWidth="2"/>
                <rect x="8"  y="40" width="24" height="24" rx="5" stroke="#6366f1" strokeOpacity="0.3" strokeWidth="2"/>
                <rect x="40" y="40" width="24" height="24" rx="5" stroke="#6366f1" strokeOpacity="0.15" strokeWidth="2" strokeDasharray="4 3"/>
                <path d="M52 46 L52 58 M46 52 L58 52" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p style={{ color: '#52525b', fontSize: '16px', margin: '0 0 6px' }}>No workspaces yet</p>
              <p style={{ color: '#3f3f46', fontSize: '14px', margin: 0 }}>Create your first one to get started.</p>
              <button className="db-empty-btn" onClick={() => setShowModal(true)}>
                + New workspace
              </button>
            </div>
          ) : (
            /* Card grid */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {workspaces.map((ws, i) => (
                <WorkspaceCard
                  key={ws.id}
                  ws={ws}
                  index={i}
                  onNavigate={() => navigate(`/workspaces/${ws.id}`)}
                  onDeleteClick={() => openDeleteModal(ws)}
                  onRenameClick={() => openRenameModal(ws)}
                  isMenuOpen={openMenuId === ws.id}
                  onMenuToggle={() => setOpenMenuId(id => id === ws.id ? null : ws.id)}
                  isFading={fadingIds.has(ws.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} onCreate={createWorkspace} />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          workspace={deleteTarget}
          onClose={() => { setDeleteTarget(null) }}
          onConfirm={deleteWorkspace}
          loading={deleteLoading}
        />
      )}

      {/* Rename modal */}
      {renameTarget && (
        <RenameModal
          current={renameTarget.name}
          label="workspace"
          onClose={() => setRenameTarget(null)}
          onRename={renameWorkspace}
        />
      )}
    </>
  )
}
