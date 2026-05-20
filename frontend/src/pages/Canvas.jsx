import { Excalidraw, getSceneVersion } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import { resolveFilesWithCache } from '../lib/imageCache'

export default function Canvas() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ready, setReady] = useState(null)   // { chapter, files } once fully loaded
  const [saveStatus, setSaveStatus] = useState('Saved')

  const pendingRef = useRef(null)
  const dirtyRef = useRef(false)
  const excalidrawAPIRef = useRef(null)
  const cdnFilesRef = useRef({})            // R2 CDN URLs — sent on every save to avoid re-upload
  const lastSavedVersionRef = useRef(-1)
  const saveTimerRef = useRef(null)
  const initializedRef = useRef(false)      // absorb first onChange as baseline

  const save = useCallback(async () => {
    if (!dirtyRef.current || !pendingRef.current) return
    dirtyRef.current = false
    const snapshot = pendingRef.current
    const snapshotVersion = getSceneVersion(snapshot.elements)
    setSaveStatus('Saving…')
    try {
      await api.patch(`/chapters/${id}/canvas`, { canvas_data: snapshot })
      lastSavedVersionRef.current = snapshotVersion
      setSaveStatus('Saved')
    } catch {
      setSaveStatus('Error saving')
      dirtyRef.current = true
    }
  }, [id])

  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(save, 2000)
  }, [save])

  const flushSave = useCallback(() => {
    if (saveTimerRef.current) { clearTimeout(saveTimerRef.current); saveTimerRef.current = null }
    save()
  }, [save])

  // Single fetch: get chapter + files, resolve CDN URLs → base64, then render everything at once
  useEffect(() => {
    let cancelled = false
    api.get(`/chapters/${id}`)
      .then(async r => {
        const rawFiles = r.data.canvas_data?.files ?? {}
        cdnFilesRef.current = rawFiles
        const excalidrawFiles = Object.keys(rawFiles).length > 0
          ? await resolveFilesWithCache(rawFiles)
          : {}
        if (!cancelled) {
          setReady({ chapter: r.data, files: excalidrawFiles })
          document.title = r.data.title
        }
      })
      .catch(() => { if (!cancelled) navigate('/dashboard') })
    return () => { cancelled = true; document.title = 'Clarito' }
  }, [id, navigate])

  // Ctrl+S / Cmd+S
  useEffect(() => {
    const onKeyDown = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); flushSave() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [flushSave])

  // Tab hidden — save immediately
  useEffect(() => {
    const onVisibilityChange = () => { if (document.visibilityState === 'hidden') flushSave() }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [flushSave])

  // Warn before unload if unsaved
  useEffect(() => {
    const onBeforeUnload = e => {
      if (!dirtyRef.current) return
      flushSave()
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [flushSave])

  useEffect(() => () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current) }, [])

  const handleChange = (elements, appState, files) => {
    // CDN URLs win over base64 for known files; new pasted images keep their base64 until saved to R2
    const mergedFiles = { ...(files ?? {}), ...cdnFilesRef.current }
    pendingRef.current = {
      elements,
      appState: { viewBackgroundColor: appState.viewBackgroundColor },
      files: mergedFiles,
    }

    const version = getSceneVersion(elements)

    if (!initializedRef.current) {
      initializedRef.current = true
      lastSavedVersionRef.current = version
      return
    }

    if (version === lastSavedVersionRef.current) return
    dirtyRef.current = true
    setSaveStatus('Unsaved changes')
    scheduleSave()
  }

  if (!ready) {
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
          minHeight: '100vh', background: '#0f0f0f',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif', gap: '28px',
        }}>
          <span style={{
            fontSize: '30px', fontWeight: '800', color: '#6366f1',
            letterSpacing: '-1.5px',
            animation: 'cv-logoIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both',
          }}>
            Clarito
          </span>
          <svg width="148" height="56" viewBox="0 0 148 56" fill="none">
            <path d="M 10 40 Q 40 10 74 28 Q 102 44 130 22"
              stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" fill="none"
              strokeDasharray="220"
              style={{ animation: 'cv-sketch 1.7s ease-in-out 0.55s infinite' }}
            />
            <path d="M 118 14 L 131 22 L 120 32"
              stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
              strokeDasharray="36"
              style={{ animation: 'cv-arrowhead 1.7s ease-in-out 0.55s infinite' }}
            />
          </svg>
          <p style={{
            color: '#3f3f46', fontSize: '13px', margin: 0, letterSpacing: '0.3px',
            animation: 'cv-textIn 0.5s ease 1.1s both',
          }}>
            Opening your canvas…
          </p>
        </div>
      </>
    )
  }

  const { chapter, files: resolvedFiles } = ready

  // Pre-mark image elements whose file is available as "saved" so Excalidraw's
  // initializeImageDimensions doesn't re-fire onChange for a dimension-only update
  const elements = (chapter.canvas_data?.elements ?? []).map(el =>
    el.type === 'image' && el.status === 'pending' && resolvedFiles[el.fileId]
      ? { ...el, status: 'saved' }
      : el
  )

  const initialData = {
    elements,
    appState: {
      theme: 'dark',
      viewBackgroundColor: chapter.canvas_data?.appState?.viewBackgroundColor ?? '#1a1a2e',
      ...(chapter.canvas_data?.appState ?? {}),
    },
    files: resolvedFiles,
  }

  const statusColor =
    saveStatus === 'Unsaved changes' ? 'text-yellow-400' :
    saveStatus === 'Error saving'    ? 'text-red-400'    :
    saveStatus === 'Saving…'         ? 'text-zinc-400'   :
                                       'text-zinc-500'

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
        <span className={`text-xs ${statusColor}`}>{saveStatus}</span>
      </div>
      <div className="flex-1">
        <Excalidraw
          excalidrawAPI={exApi => { excalidrawAPIRef.current = exApi }}
          initialData={initialData}
          onChange={handleChange}
          theme="dark"
        />
      </div>
    </div>
  )
}
