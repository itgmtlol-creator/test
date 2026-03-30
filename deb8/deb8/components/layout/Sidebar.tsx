import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Sidebar() {
  const supabase = createClient()

  const { data: topUsers } = await supabase
    .from('profiles')
    .select('username, credibility_score')
    .order('credibility_score', { ascending: false })
    .limit(5)

  const { data: trendingDebates } = await supabase
    .from('debates')
    .select('id, title, argument_count')
    .order('argument_count', { ascending: false })
    .limit(4)

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-6">

        {/* Trending */}
        <div className="card p-4">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-3">
            Trending Debates
          </h3>
          <div className="space-y-2">
            {trendingDebates && trendingDebates.length > 0 ? (
              trendingDebates.map(d => (
                <Link
                  key={d.id}
                  href={`/debates/${d.id}`}
                  className="block text-sm text-zinc-400 hover:text-white transition-colors leading-snug"
                >
                  {d.title}
                  <span className="text-xs text-zinc-600 ml-1">
                    {d.argument_count ?? 0} args
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-xs text-zinc-700">No debates yet.</p>
            )}
          </div>
        </div>

        {/* Top Users */}
        <div className="card p-4">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-3">
            Top Debaters
          </h3>
          <div className="space-y-2">
            {topUsers && topUsers.length > 0 ? (
              topUsers.map((u, i) => (
                <Link
                  key={u.username}
                  href={`/profile/${u.username}`}
                  className="flex items-center justify-between text-sm hover:text-white transition-colors text-zinc-400"
                >
                  <span>
                    <span className="text-zinc-600 text-xs mr-2">#{i + 1}</span>
                    @{u.username}
                  </span>
                  <span className="text-xs text-zinc-500">{u.credibility_score}</span>
                </Link>
              ))
            ) : (
              <p className="text-xs text-zinc-700">No users yet.</p>
            )}
          </div>
        </div>

        {/* Live placeholder */}
        <div className="card p-4 border-dashed">
          <h3 className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">
            Live Debates
          </h3>
          <p className="text-xs text-zinc-700 mb-3">Real-time debates coming soon.</p>
          <Link href="/live" className="text-xs text-zinc-500 hover:text-white transition-colors">
            Join waitlist →
          </Link>
        </div>

      </div>
    </aside>
  )
}
