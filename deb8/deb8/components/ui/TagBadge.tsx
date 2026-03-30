import { TAG_STYLES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function TagBadge({ tag }: { tag: string }) {
  const style = TAG_STYLES[tag] ?? TAG_STYLES['C']
  return (
    <span
      className={cn(
        'text-xs font-mono px-2 py-0.5 rounded',
        style.bg,
        style.text
      )}
    >
      [{tag}] {style.label}
    </span>
  )
}
