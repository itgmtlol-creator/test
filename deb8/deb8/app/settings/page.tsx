'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<any>(null)
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      setProfile(p)
      setBio(p?.bio ?? '')
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSaveMsg(null)

    const { error } = await supabase
      .from('profiles')
      .update({ bio: bio.trim() })
      .eq('id', profile.id)

    if (error) {
      setError(error.message)
    } else {
      setSaveMsg('Saved.')
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!profile) {
    return (
      <AppShell>
        <div className="text-center py-20 text-zinc-600 text-sm">Loading...</div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

        {/* Account info */}
        <div className="card p-6 mb-6">
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <label className="label">Username</label>
              <input type="text" className="input opacity-50 cursor-not-allowed" value={profile.username} disabled />
              <p className="text-xs text-zinc-700 mt-1">Username cannot be changed in V1.</p>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input opacity-50 cursor-not-allowed" value={profile.email} disabled />
            </div>
            <div>
              <label className="label">Credibility Score</label>
              <input type="text" className="input opacity-50 cursor-not-allowed" value={profile.credibility_score} disabled />
            </div>
          </div>
        </div>

        {/* Profile */}
        <form onSubmit={handleSave} className="card p-6 mb-6">
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Profile</h2>
          <div>
            <label className="label">Bio</label>
            <textarea
              className="input resize-none"
              rows={4}
              placeholder="Tell the community who you are..."
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={300}
            />
            <div className="text-right text-xs text-zinc-700 mt-1">{bio.length}/300</div>
          </div>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          {saveMsg && <p className="text-xs text-green-500 mt-2">{saveMsg}</p>}

          <div className="mt-4">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Danger zone */}
        <div className="card p-6 border-red-950">
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Session</h2>
          <button onClick={handleSignOut} className="btn-danger">
            Sign out
          </button>
        </div>
      </div>
    </AppShell>
  )
}
