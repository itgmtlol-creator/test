import { clsx, type ClassValue } from 'clsx'
import { formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function timeAgo(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + '...' : str
}

export type Argument = {
  id: string
  debate_id: string
  author_id: string
  parent_id: string | null
  content: string
  tag: string
  created_at: string
  profiles?: { username: string; credibility_score: number }
  children?: Argument[]
}

export function buildTree(args: Argument[]): Argument[] {
  const map = new Map<string, Argument>()
  const roots: Argument[] = []

  args.forEach(a => {
    map.set(a.id, { ...a, children: [] })
  })

  map.forEach(a => {
    if (a.parent_id && map.has(a.parent_id)) {
      map.get(a.parent_id)!.children!.push(a)
    } else {
      roots.push(a)
    }
  })

  return roots
}
