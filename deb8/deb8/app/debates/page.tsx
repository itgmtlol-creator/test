import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/layout/AppShell'
import Sidebar from '@/components/layout/Sidebar'
import DebateCard from '@/components/debate/DebateCard'
import EmptyState from '@/components/ui/EmptyState'
import { CATEGORIES } from '@/lib/constants'
import Link from 'next/link'

type Props = {
  searchParams: { cat?: string; sort?: string }
}

export default async function DebatesFeedPage({ searchParams }: Props) {
  const supabase = createClient()
  const { cat, sort } = searchParams

  let query = supabase
    .from('debates')
    .select('id, title, category, created_at, argument_count, opening_statement, profiles(username, credibility_score)')

  if (cat) query = query.eq('category', cat)

  if (sort === 'active') {
    query = query.order('argument_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: debates, error } = await query.limit(30)

  return (
    <AppShell>
      <div className="flex gap-8">
        {/* Main feed */}
        <div className="flex-1 min-w-0">
          {/* Filter bar */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/debates"
                className={`text-xs px-3 py-1.5 rounded border transition-colors ${!cat ? 'border-zinc-600 text-white bg-zinc-900' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
              >
                All
              </Link>
              {CATEGORIES.map(c => (
                <Link
                  key={c}
                  href={`/debates?cat=${encodeURIComponent(c)}${sort ? `&sort=${sort}` : ''}`}
                  className={`text-xs px-3 py-1.5 rounded border transition-colors ${cat === c ? 'border-zinc-600 text-white bg-zinc-900' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
                >
                  {c}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/debates${cat ? `?cat=${cat}&` : '?'}sort=new`}
                className={`text-xs px-3 py-1 rounded transition-colors ${(!sort || sort === 'new') ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                New
              </Link>
              <span className="text-zinc-800">|</span>
              <Link
                href={`/debates${cat ? `?cat=${cat}&` : '?'}sort=active`}
                className={`text-xs px-3 py-1 rounded transition-colors ${sort === 'active' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                Most Active
              </Link>
            </div>
          </div>

          {/* Cards */}
          {error && (
            <p className="text-xs text-red-400 mb-4">Error loading debates: {error.message}</p>
          )}
          {!debates || debates.length === 0 ? (
            <EmptyState
              message="No debates yet."
              sub="Be the first — start a debate."
            />
          ) : (
            <div className="space-y-3">
              {debates.map((d: any) => (
                <DebateCard key={d.id} debate={d} />
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <Sidebar />
      </div>
    </AppShell>
  )
}
