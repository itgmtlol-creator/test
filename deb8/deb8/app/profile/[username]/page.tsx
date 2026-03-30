import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/layout/AppShell'
import DebateCard from '@/components/debate/DebateCard'
import EmptyState from '@/components/ui/EmptyState'
import { timeAgo } from '@/lib/utils'
import TagBadge from '@/components/ui/TagBadge'

type Props = { params: { username: string } }

export async function generateMetadata({ params }: Props) {
  return { title: `@${params.username} — DEB8` }
}

export default async function ProfilePage({ params }: Props) {
  const supabase = createClient()
  const username = decodeURIComponent(params.username)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) return notFound()

  const { data: debates } = await supabase
    .from('debates')
    .select('id, title, category, created_at, argument_count, opening_statement, profiles(username, credibility_score)')
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: recentArgs } = await supabase
    .from('arguments')
    .select('id, content, tag, created_at, debate_id, debates(title)')
    .eq('author_id', profile.id)
    .neq('tag', 'OPENING')
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: totalArgs } = await supabase
    .from('arguments')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', profile.id)
    .neq('tag', 'OPENING')

  const { count: totalDebates } = await supabase
    .from('debates')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', profile.id)

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        {/* Profile header */}
        <div className="card p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-white shrink-0">
              {profile.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white">@{profile.username}</h1>
              {profile.bio && (
                <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{profile.bio}</p>
              )}
              <p className="text-xs text-zinc-600 mt-2">
                Joined {timeAgo(profile.created_at)}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-white">{profile.credibility_score}</div>
              <div className="text-xs text-zinc-600 uppercase tracking-wider">Credibility</div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 mt-5 pt-4 border-t border-zinc-800">
            <div>
              <div className="text-lg font-semibold text-white">{totalDebates ?? 0}</div>
              <div className="text-xs text-zinc-600">Debates</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-white">{totalArgs ?? 0}</div>
              <div className="text-xs text-zinc-600">Arguments</div>
            </div>
          </div>
        </div>

        {/* Recent arguments */}
        {recentArgs && recentArgs.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Recent Arguments</h2>
            <div className="card divide-y divide-zinc-900">
              {recentArgs.map((arg: any) => (
                <div key={arg.id} className="p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <TagBadge tag={arg.tag} />
                    <span className="text-xs text-zinc-600">in</span>
                    <a
                      href={`/debates/${arg.debate_id}`}
                      className="text-xs text-zinc-400 hover:text-white transition-colors truncate max-w-xs"
                    >
                      {arg.debates?.title ?? 'Debate'}
                    </a>
                    <span className="text-xs text-zinc-700 ml-auto">{timeAgo(arg.created_at)}</span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{arg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debates */}
        <div>
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Debates Started</h2>
          {!debates || debates.length === 0 ? (
            <EmptyState message="No debates started yet." />
          ) : (
            <div className="space-y-3">
              {debates.map((d: any) => <DebateCard key={d.id} debate={d} />)}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
