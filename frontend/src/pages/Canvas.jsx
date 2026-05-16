import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'

export default function Canvas() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [chapter, setChapter] = useState(state?.chapter ?? null)
  const [saveStatus, setSaveStatus] = useState('saved')
  const pendingRef = useRef(null)
  const dirtyRef = useRef(false)
  const lastSavedAtRef = useRef(0)

  useEffect(() => {
    if (state?.chapter) {
      document.title = state.chapter.title
    }
    // Always fetch in background to get latest canvas_data
    api.get(`/chapters/${id}`)
      .then(r => {
        setChapter(r.data)
        document.title = r.data.title
      })
      .catch(() => navigate('/dashboard'))
    return () => { document.title = 'Clarito' }
  }, [id, navigate])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!dirtyRef.current || !pendingRef.current) return
      dirtyRef.current = false
      setSaveStatus('saving…')
      try {
        await api.patch(`/chapters/${id}/canvas`, { canvas_data: pendingRef.current })
        lastSavedAtRef.current = Date.now()
        setSaveStatus('saved')
      } catch {
        setSaveStatus('error')
        dirtyRef.current = true
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [id])

  const handleChange = (elements, appState, files) => {
    pendingRef.current = { elements, appState: { viewBackgroundColor: appState.viewBackgroundColor }, files: files ?? {} }
    dirtyRef.current = true
    // Excalidraw fires onChange immediately after a save completes — ignore those
    // calls for 1s so the 'saved' status is visible before flipping to 'unsaved'.
    if (Date.now() - lastSavedAtRef.current > 1000) {
      setSaveStatus('unsaved')
    }
  }

  if (!chapter) {
    return (
      <>
        <style>{`
          @keyframes cv-logoIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes cv-textIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes cv-sketch {
            0%       { stroke-dashoffset: 220; opacity: 0.9; }
            60%      { stroke-dashoffset: 0;   opacity: 0.9; }
            78%      { stroke-dashoffset: 0;   opacity: 0.15; }
            95%      { stroke-dashoffset: 220; opacity: 0.15; }
            100%     { stroke-dashoffset: 220; opacity: 0.9; }
          }
          @keyframes cv-arrowhead {
            0%, 48%  { stroke-dashoffset: 36; opacity: 0; }
            68%      { stroke-dashoffset: 0;  opacity: 0.9; }
            78%      { stroke-dashoffset: 0;  opacity: 0.15; }
            95%      { stroke-dashoffset: 36; opacity: 0.15; }
            100%     { stroke-dashoffset: 36; opacity: 0; }
          }
        `}</style>
        <div style={{
          minHeight: '100vh',
          background: '#0f0f0f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          gap: '28px',
        }}>
          {/* Wordmark */}
          <span style={{
            fontSize: '30px',
            fontWeight: '800',
            color: '#6366f1',
            letterSpacing: '-1.5px',
            animation: 'cv-logoIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both',
          }}>
            Clarito
          </span>

          {/* Excalidraw-style sketch loop */}
          <svg width="148" height="56" viewBox="0 0 148 56" fill="none">
            <path
              d="M 10 40 Q 40 10 74 28 Q 102 44 130 22"
              stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" fill="none"
              strokeDasharray="220"
              style={{ animation: 'cv-sketch 1.7s ease-in-out 0.55s infinite' }}
            />
            <path
              d="M 118 14 L 131 22 L 120 32"
              stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
              strokeDasharray="36"
              style={{ animation: 'cv-arrowhead 1.7s ease-in-out 0.55s infinite' }}
            />
          </svg>

          {/* Subtitle */}
          <p style={{
            color: '#3f3f46',
            fontSize: '13px',
            margin: 0,
            letterSpacing: '0.3px',
            animation: 'cv-textIn 0.5s ease 1.1s both',
          }}>
            Opening your canvas…
          </p>
        </div>
      </>
    )
  }

  const initialData = {
    elements: chapter.canvas_data?.elements ?? [],
    appState: {
      theme: 'dark',
      viewBackgroundColor: chapter.canvas_data?.appState?.viewBackgroundColor ?? '#1a1a2e',
      ...(chapter.canvas_data?.appState ?? {}),
    },
    files: chapter.canvas_data?.files ?? {},
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            ←
          </button>
          <span className="text-white font-medium text-sm">{chapter.title}</span>
        </div>
        <span className={`text-xs ${saveStatus === 'error' ? 'text-red-400' : saveStatus === 'unsaved' ? 'text-yellow-400' : 'text-zinc-500'}`}>
          {saveStatus}
        </span>
      </div>
      <div className="flex-1">
        <Excalidraw
          initialData={initialData}
          onChange={handleChange}
          theme="dark"
        />
      </div>
    </div>
  )
}
