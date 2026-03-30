'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, CREDIBILITY_REWARDS } from '@/lib/constants'

export default function NewDebatePage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [opening, setOpening] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !opening.trim()) return
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Create debate
    const { data: debate, error: debateError } = await supabase
      .from('debates')
      .insert({
        title: title.trim(),
        category,
        author_id: user.id,
        opening_statement: opening.trim(),
        argument_count: 0,
      })
      .select('id')
      .single()

    if (debateError) { setError(debateError.message); setLoading(false); return }

    // Create opening argument
    const { error: argError } = await supabase.from('arguments').insert({
      debate_id: debate.id,
      author_id: user.id,
      parent_id: null,
      content: opening.trim(),
      tag: 'OPENING',
    })

    if (argError) { setError(argError.message); setLoading(false); return }

    // Award credibility
    await supabase.rpc('increment_credibility', {
      user_id: user.id,
      amount: CREDIBILITY_REWARDS.START_DEBATE,
    })

    router.push(`/debates/${debate.id}`)
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">New Debate</h1>
          <p className="text-zinc-500 text-sm">
            State a clear position. Others will challenge, support, and rebut.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="label">Debate Title</label>
            <input
              type="text"
              className="input text-base"
              placeholder="e.g. Universal Basic Income would reduce innovation"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              maxLength={200}
            />
            <div className="text-right text-xs text-zinc-700 mt-1">{title.length}/200</div>
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              required
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Opening statement */}
          <div>
            <label className="label">Opening Statement</label>
            <p className="text-xs text-zinc-600 mb-2">
              This becomes your first [OPENING] argument. Make it clear and substantive.
            </p>
            <textarea
              className="input resize-none"
              rows={8}
              placeholder="State your full position here. Provide context, your core claim, and ideally the reasoning behind it. Others will respond with evidence, counters, and rebuttals."
              value={opening}
              onChange={e => setOpening(e.target.value)}
              required
              maxLength={5000}
            />
            <div className="text-right text-xs text-zinc-700 mt-1">{opening.length}/5000</div>
          </div>

          {/* Credibility note */}
          <div className="bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-xs text-zinc-500">
            Starting a debate awards <span className="text-zinc-300">+{CREDIBILITY_REWARDS.START_DEBATE} credibility</span> points.
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950 border border-red-900 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !opening.trim()}
              className="btn-primary px-6"
            >
              {loading ? 'Publishing...' : 'Publish Debate'}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
