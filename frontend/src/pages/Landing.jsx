import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-6xl font-bold tracking-tight mb-3">Clarito</h1>
      <p className="text-zinc-400 text-lg mb-10">Visual canvas for chapter-based learning.</p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-2.5 bg-white text-zinc-950 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-2.5 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  )
}
