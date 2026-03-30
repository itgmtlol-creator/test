import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/layout/AppShell'
import DebateThread from '@/components/debate/DebateThread'
import CategoryBadge from '@/components/ui/CategoryBadge'
import CredibilityBadge from '@/components/ui/CredibilityBadge'
import { buildTree, timeAgo } from '@/lib/utils'
import Link from 'next/link'

type Props = { params: { id: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = createClient()
  const { data } = await supabase.from('debates').select('title').eq('id', params.id).single()
  return { title: data ? `${data.title} — DEB8` : 'Debate — DEB8' }
}

export default async function DebateDetailPage({ params }: Props) {
  const supabase = createClient()

  // Fetch debate
  const { data: debate, error } = await supabase
    .from('debates')
    .select('*, profiles(username, credibility_score)')
    .eq('id', params.id)
    .single()

  if (error || !debate) return notFound()

  // Fetch all arguments (flat, then build tree)
  const { data: rawArgs } = await supabase
    .from('arguments')
    .select('*, profiles(username, credibility_score)')
    .eq('debate_id', params.id)
    .order('created_at', { ascending: true })

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  const allArgs = rawArgs ?? []
  const opening = allArgs.find(a => a.tag === 'OPENING')
  const nonOpening = allArgs.filter(a => a.tag !== 'OPENING')
  const tree = buildTree(nonOpening)

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
          <Link href="/debates" className="hover:text-zinc-400 transition-colors">Debates</Link>
          <span>/</span>
          <span className="text-zinc-500 truncate">{debate.title}</span>
        </div>

        {/* Debate header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <CategoryBadge category={debate.category} />
            <span className="text-xs text-zinc-600">{timeAgo(debate.created_at)}</span>
            <span className="text-xs text-zinc-600">
              {debate.argument_count ?? 0} argument{debate.argument_count !== 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white leading-snug mb-3">
            {debate.title}
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Started by</span>
            <Link
              href={`/profile/${debate.profiles?.username}`}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              @{debate.profiles?.username ?? 'unknown'}
            </Link>
            {debate.profiles && (
              <CredibilityBadge score={debate.profiles.credibility_score} />
            )}
          </div>
        </div>

        {/* Thread */}
        {opening ? (
          <DebateThread
            opening={opening}
            topLevelArgs={tree}
            debateId={debate.id}
            currentUserId={user?.id ?? null}
          />
        ) : (
          <DebateThread
            opening={{
              id: 'placeholder',
              debate_id: debate.id,
              author_id: debate.author_id,
              parent_id: null,
              content: debate.opening_statement ?? '',
              tag: 'OPENING',
              created_at: debate.created_at,
              profiles: debate.profiles,
              children: [],
            }}
            topLevelArgs={tree}
            debateId={debate.id}
            currentUserId={user?.id ?? null}
          />
        )}
      </div>
    </AppShell>
  )
}
