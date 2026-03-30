'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (username.length < 3) {
      setError('Username must be at least 3 characters.')
      setLoading(false)
      return
    }

    // Check username uniqueness
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single()

    if (existing) {
      setError('That username is taken.')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.toLowerCase() },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Insert profile row
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username: username.toLowerCase(),
        email,
        credibility_score: 0,
      })
      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }
    }

    router.push('/debates')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-white font-bold text-xl tracking-tight">
            DEB<span className="text-zinc-500">8</span>
          </Link>
          <p className="text-zinc-500 text-sm mt-2">Create your account</p>
        </div>

        <form onSubmit={handleRegister} className="card p-6 space-y-4">
          <div>
            <label className="label">Username</label>
            <input
              type="text"
              className="input"
              placeholder="yourhandle"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              required
              minLength={3}
              maxLength={30}
              autoFocus
            />
            <p className="text-xs text-zinc-700 mt-1">Letters, numbers, underscores only.</p>
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950 border border-red-900 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-400 hover:text-white transition-colors underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
