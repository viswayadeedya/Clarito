import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'

export default function Canvas() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chapter, setChapter] = useState(null)
  const [saveStatus, setSaveStatus] = useState('saved')
  const pendingRef = useRef(null)
  const dirtyRef = useRef(false)
  const lastSavedAtRef = useRef(0)

  useEffect(() => {
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
        Loading…
      </div>
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
