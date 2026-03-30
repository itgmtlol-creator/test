export const CATEGORIES = [
  'Politics',
  'Economics',
  'Society',
  'Technology',
  'Ethics',
  'Open Floor',
] as const

export type Category = (typeof CATEGORIES)[number]

export const ARGUMENT_TAGS = [
  { value: 'C', label: 'Counter', description: 'Directly oppose a claim' },
  { value: 'E', label: 'Evidence', description: 'Provide data or sources' },
  { value: 'R', label: 'Rebuttal', description: 'Refute a counter argument' },
  { value: 'S', label: 'Support', description: 'Support the parent claim' },
] as const

export type ArgumentTag = 'C' | 'E' | 'R' | 'S' | 'OPENING'

export const TAG_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  C: { bg: 'bg-zinc-800', text: 'text-zinc-200', label: 'Counter' },
  E: { bg: 'bg-zinc-800', text: 'text-zinc-200', label: 'Evidence' },
  R: { bg: 'bg-zinc-800', text: 'text-zinc-200', label: 'Rebuttal' },
  S: { bg: 'bg-zinc-800', text: 'text-zinc-200', label: 'Support' },
  OPENING: { bg: 'bg-white', text: 'text-black', label: 'Opening' },
}

export const CREDIBILITY_REWARDS = {
  START_DEBATE: 2,
  POST_ARGUMENT: 1,
  POST_EVIDENCE: 2,
}
