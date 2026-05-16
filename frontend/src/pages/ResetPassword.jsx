import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/client'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, new_password: password })
      setDone(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired link.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">Invalid reset link.</p>
          <Link to="/login" className="text-zinc-400 hover:text-white text-sm">← Back to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Reset password</h1>
        <p className="text-zinc-500 text-sm text-center mb-8">Enter your new password.</p>

        {done ? (
          <div className="text-center text-zinc-300 text-sm bg-zinc-800 rounded-lg px-5 py-4">
            Password reset! Redirecting to login…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="px-4 py-2.5 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:border-zinc-500 placeholder-zinc-500"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="px-4 py-2.5 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:border-zinc-500 placeholder-zinc-500"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 bg-white text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Resetting…' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
