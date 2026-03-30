'use client'

import AppShell from '@/components/layout/AppShell'
import { useState } from 'react'

const UPCOMING = [
  { title: 'AI should be regulated like nuclear weapons', date: 'April 12 · 7PM EST', participants: 2 },
  { title: 'Democracy is incompatible with long-term climate action', date: 'April 14 · 6PM EST', participants: 2 },
  { title: 'Social media has been net negative for democracy', date: 'April 18 · 8PM EST', participants: 4 },
  { title: 'Effective altruism does more harm than good', date: 'April 22 · 7PM EST', participants: 2 },
]

export default function LivePage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl mb-10">
          <div className="inline-block text-xs font-mono text-zinc-600 border border-zinc-800 px-3 py-1 rounded-full mb-6">
            Coming Soon
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Live Debates</h1>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
            Real-time structured debates between two or more participants — streamed live with
            live audience voting and structured argument rounds.
          </p>

          {/* Waitlist */}
          <div className="mt-8 flex gap-2 justify-center max-w-sm mx-auto">
            {!submitted ? (
              <>
                <input
                  type="email"
                  className="input flex-1"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <button
                  className="btn-primary shrink-0"
                  onClick={() => { if (email) setSubmitted(true) }}
                >
                  Join Waitlist
                </button>
              </>
            ) : (
              <p className="text-sm text-zinc-400">
                ✓ You're on the list. We'll notify you when live debates launch.
              </p>
            )}
          </div>
        </div>

        {/* Feature preview */}
        <div className="mb-10">
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">What to expect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '⏱', title: 'Timed rounds', desc: 'Each speaker gets structured time per argument round.' },
              { icon: '📊', title: 'Live audience votes', desc: 'The audience votes on each argument in real time.' },
              { icon: '🏆', title: 'Credibility stakes', desc: 'Win a live debate, earn a major credibility bonus.' },
              { icon: '🎥', title: 'Recorded archive', desc: 'Every debate is saved and browsable afterward.' },
            ].map(f => (
              <div key={f.title} className="card p-4">
                <div className="text-lg mb-2">{f.icon}</div>
                <div className="text-sm font-medium text-white mb-1">{f.title}</div>
                <div className="text-xs text-zinc-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming debates */}
        <div>
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Upcoming Debates</h2>
          <div className="space-y-2">
            {UPCOMING.map(d => (
              <div key={d.title} className="card px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-zinc-300 truncate">{d.title}</div>
                  <div className="text-xs text-zinc-600 mt-0.5">{d.date}</div>
                </div>
                <button className="btn-ghost text-xs px-3 py-1.5 shrink-0" disabled>
                  Notify me
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
