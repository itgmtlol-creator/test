import { cn } from '@/lib/utils'

export default function CredibilityBadge({ score }: { score: number }) {
  return (
    <span
      className={cn(
        'text-xs font-mono px-1.5 py-0.5 rounded border',
        score >= 50
          ? 'border-zinc-500 text-zinc-300'
          : score >= 20
          ? 'border-zinc-700 text-zinc-500'
          : 'border-zinc-800 text-zinc-600'
      )}
    >
      {score} cred
    </span>
  )
}
