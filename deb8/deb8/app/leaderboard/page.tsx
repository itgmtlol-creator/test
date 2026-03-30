import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/layout/AppShell'
import Link from 'next/link'

export const metadata = { title: 'Leaderboard — DEB8' }

export default async function LeaderboardPage() {
  const supabase = createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('id, username, credibility_score, created_at')
    .order('credibility_score', { ascending: false })
    .limit(50)

  // Get debate + argument counts per user
  const userIds = (users ?? []).map(u => u.id)
  const { data: debateCounts } = await supabase
    .from('debates')
    .select('author_id')
    .in('author_id', userIds)

  const { data: argCounts } = await supabase
    .from('arguments')
    .select('author_id')
    .in('author_id', userIds)
    .neq('tag', 'OPENING')

  const debateMap = new Map<string, number>()
  const argMap = new Map<string, number>()
  debateCounts?.forEach(d => debateMap.set(d.author_id, (debateMap.get(d.author_id) ?? 0) + 1))
  argCounts?.forEach(a => argMap.set(a.author_id, (argMap.get(a.author_id) ?? 0) + 1))

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Leaderboard</h1>
          <p className="text-sm text-zinc-500">
            Ranked by credibility score. Earn points by starting debates and posting quality arguments.
          </p>
        </div>

        <div className="card overflow-hidden">
          <div className="grid grid-cols-12 text-xs text-zinc-600 uppercase tracking-wider px-5 py-3 border-b border-zinc-800">
            <span className="col-span-1">#</span>
            <span className="col-span-5">User</span>
            <span className="col-span-2 text-right">Debates</span>
            <span className="col-span-2 text-right">Args</span>
            <span className="col-span-2 text-right">Score</span>
          </div>

          {!users || users.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-600">No users yet.</div>
          ) : (
            <div className="divide-y divide-zinc-900">
              {users.map((user, i) => (
                <div
                  key={user.id}
                  className={`grid grid-cols-12 px-5 py-4 items-center hover:bg-zinc-900 transition-colors ${i === 0 ? 'bg-zinc-900/50' : ''}`}
                >
                  <span className="col-span-1 text-sm font-mono text-zinc-600">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </span>
                  <div className="col-span-5">
                    <Link
                      href={`/profile/${user.username}`}
                      className="text-sm text-zinc-300 hover:text-white transition-colors font-medium"
                    >
                      @{user.username}
                    </Link>
                  </div>
                  <span className="col-span-2 text-right text-sm text-zinc-500">
                    {debateMap.get(user.id) ?? 0}
                  </span>
                  <span className="col-span-2 text-right text-sm text-zinc-500">
                    {argMap.get(user.id) ?? 0}
                  </span>
                  <span className={`col-span-2 text-right text-sm font-mono font-semibold ${i === 0 ? 'text-white' : 'text-zinc-400'}`}>
                    {user.credibility_score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scoring key */}
        <div className="mt-6 card p-4">
          <h3 className="text-xs text-zinc-600 uppercase tracking-widest mb-3">How scoring works</h3>
          <div className="space-y-2 text-xs text-zinc-500">
            <div className="flex justify-between"><span>Start a debate</span><span className="text-zinc-300">+2</span></div>
            <div className="flex justify-between"><span>Post an argument [C/R/S]</span><span className="text-zinc-300">+1</span></div>
            <div className="flex justify-between"><span>Post evidence [E]</span><span className="text-zinc-300">+2</span></div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
