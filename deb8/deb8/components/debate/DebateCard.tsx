import Link from 'next/link'
import { timeAgo, truncate } from '@/lib/utils'
import CategoryBadge from '@/components/ui/CategoryBadge'
import CredibilityBadge from '@/components/ui/CredibilityBadge'

type DebateCardProps = {
  debate: {
    id: string
    title: string
    category: string
    created_at: string
    argument_count?: number
    profiles?: {
      username: string
      credibility_score: number
    }
    opening_statement?: string
  }
}

export default function DebateCard({ debate }: DebateCardProps) {
  return (
    <Link href={`/debates/${debate.id}`} className="block card p-5 hover:border-zinc-700 transition-colors group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={debate.category} />
          {debate.profiles && (
            <CredibilityBadge score={debate.profiles.credibility_score} />
          )}
        </div>
        <span className="text-xs text-zinc-600 shrink-0">{timeAgo(debate.created_at)}</span>
      </div>

      <h2 className="text-white font-medium text-base leading-snug group-hover:text-zinc-100 mb-2">
        {debate.title}
      </h2>

      {debate.opening_statement && (
        <p className="text-zinc-500 text-sm leading-relaxed mb-3">
          {truncate(debate.opening_statement, 160)}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-zinc-600">
          by{' '}
          <span className="text-zinc-400">@{debate.profiles?.username ?? 'unknown'}</span>
        </span>
        <span className="text-xs text-zinc-600">
          {debate.argument_count ?? 0} argument{(debate.argument_count ?? 0) !== 1 ? 's' : ''}
        </span>
      </div>
    </Link>
  )
}
