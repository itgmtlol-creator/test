'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ARGUMENT_TAGS, CREDIBILITY_REWARDS } from '@/lib/constants'
import type { Argument } from '@/lib/utils'

type Props = {
  debateId: string
  parentId: string | null
  onSuccess: (arg: Argument) => void
  onCancel?: () => void
}

export default function ArgumentForm({ debateId, parentId, onSuccess, onCancel }: Props) {
  const [content, setContent] = useState('')
  const [tag, setTag] = useState<string>('C')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be logged in.'); setLoading(false); return }

    const { data: newArg, error: argError } = await supabase
      .from('arguments')
      .insert({
        debate_id: debateId,
        author_id: user.id,
        parent_id: parentId,
        content: content.trim(),
        tag,
      })
      .select('*, profiles(username, credibility_score)')
      .single()

    if (argError) { setError(argError.message); setLoading(false); return }

    // Award credibility
    const reward = tag === 'E' ? CREDIBILITY_REWARDS.POST_EVIDENCE : CREDIBILITY_REWARDS.POST_ARGUMENT
    await supabase.rpc('increment_credibility', { user_id: user.id, amount: reward })

    setContent('')
    onSuccess({ ...newArg, children: [] })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
      {/* Tag selector */}
      <div>
        <label className="label">Argument Type</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {ARGUMENT_TAGS.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTag(t.value)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                tag === t.value
                  ? 'border-zinc-400 text-white bg-zinc-800'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              [{t.value}] {t.label}
              <span className="text-zinc-600 ml-1 hidden sm:inline">— {t.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="label">Your Argument</label>
        <textarea
          className="input resize-none"
          rows={4}
          placeholder="State your argument clearly and concisely..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          maxLength={2000}
        />
        <div className="text-right text-xs text-zinc-700 mt-1">{content.length}/2000</div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
        <button type="submit" disabled={loading || !content.trim()} className="btn-primary">
          {loading ? 'Posting...' : 'Post Argument'}
        </button>
      </div>
    </form>
  )
}
