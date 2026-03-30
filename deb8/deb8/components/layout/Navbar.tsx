'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/debates', label: 'Debates' },
  { href: '/categories', label: 'Categories' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/live', label: 'Live' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ email?: string; id: string } | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      if (data.user) {
        supabase
          .from('profiles')
          .select('username')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profile }) => setUsername(profile?.username ?? null))
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setUsername(null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="border-b border-zinc-800 bg-[#0a0a0a] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="text-white font-bold text-lg tracking-tight shrink-0">
          DEB<span className="text-zinc-500">8</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm px-3 py-1.5 rounded transition-colors',
                pathname.startsWith(link.href)
                  ? 'text-white bg-zinc-800'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <>
              <Link href="/debates/new" className="btn-primary text-xs px-3 py-1.5 hidden sm:inline-flex">
                + New Debate
              </Link>
              {username && (
                <Link
                  href={`/profile/${username}`}
                  className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
                >
                  @{username}
                </Link>
              )}
              <Link href="/settings" className="text-sm text-zinc-500 hover:text-white transition-colors hidden sm:block">
                Settings
              </Link>
              <button onClick={handleSignOut} className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-xs px-3 py-1.5">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary text-xs px-3 py-1.5">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
