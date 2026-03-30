import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES } from '@/lib/constants'
import { timeAgo, truncate } from '@/lib/utils'
import CategoryBadge from '@/components/ui/CategoryBadge'

export default async function LandingPage() {
  const supabase = createClient()
  const { data: recentDebates } = await supabase
    .from('debates')
    .select('id, title, category, created_at, argument_count, profiles(username)')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <header className="border-b border-zinc-800 px-6 h-14 flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-bold text-lg tracking-tight">DEB<span className="text-zinc-500">8</span></span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-xs px-3 py-1.5">Sign in</Link>
          <Link href="/register" className="btn-primary text-xs px-3 py-1.5">Get started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-block text-xs font-mono text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full mb-8">
          Structured debate platform
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight text-white mb-6">
          Structured debate,<br />
          <span className="text-zinc-500">without the noise.</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          DEB8 is where ideas are tested. Post a claim, challenge it with evidence, and let
          the best argument win — in public, in full view.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/debates" className="btn-primary px-6 py-2.5 text-sm">
            Browse Debates
          </Link>
          <Link href="/register" className="btn-ghost px-6 py-2.5 text-sm">
            Enter Platform →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-900 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest text-center mb-10">
            How DEB8 Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Post a Claim', desc: 'State a position clearly. Any topic — politics, tech, ethics, economics.' },
              { step: '02', title: 'Structured Replies', desc: 'Others respond with tagged arguments: [C] Counter, [E] Evidence, [R] Rebuttal, [S] Support.' },
              { step: '03', title: 'Build Credibility', desc: 'Quality contributions earn credibility. The best debaters rise to the top.' },
            ].map(item => (
              <div key={item.step} className="card p-6">
                <div className="text-xs font-mono text-zinc-600 mb-3">{item.step}</div>
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live debate feed preview */}
      {recentDebates && recentDebates.length > 0 && (
        <section className="border-t border-zinc-900 py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs text-zinc-500 uppercase tracking-widest">Recent Debates</h2>
              <Link href="/debates" className="text-xs text-zinc-500 hover:text-white transition-colors">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentDebates.map((d: any) => (
                <Link
                  key={d.id}
                  href={`/debates/${d.id}`}
                  className="card flex items-center gap-4 px-5 py-4 hover:border-zinc-700 transition-colors group"
                >
                  <CategoryBadge category={d.category} />
                  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors flex-1 min-w-0 truncate">
                    {d.title}
                  </span>
                  <span className="text-xs text-zinc-600 shrink-0">{timeAgo(d.created_at)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="border-t border-zinc-900 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs text-zinc-500 uppercase tracking-widest text-center mb-10">Categories</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                href={`/categories?cat=${encodeURIComponent(cat)}`}
                className="text-sm border border-zinc-800 text-zinc-400 px-4 py-2 rounded hover:border-zinc-600 hover:text-white transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-900 py-24 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to debate?</h2>
          <p className="text-zinc-500 mb-8 text-sm leading-relaxed">
            Join DEB8 and start making arguments that actually matter.
          </p>
          <Link href="/register" className="btn-primary px-8 py-3">
            Create your account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6 text-center text-xs text-zinc-700">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DEB<span className="text-zinc-600">8</span> — Structured debate platform</span>
          <div className="flex gap-4">
            <Link href="/debates" className="hover:text-zinc-500 transition-colors">Debates</Link>
            <Link href="/leaderboard" className="hover:text-zinc-500 transition-colors">Leaderboard</Link>
            <Link href="/live" className="hover:text-zinc-500 transition-colors">Live</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
