import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/layout/AppShell'
import DebateCard from '@/components/debate/DebateCard'
import EmptyState from '@/components/ui/EmptyState'
import { CATEGORIES } from '@/lib/constants'
import Link from 'next/link'

export const metadata = { title: 'Categories — DEB8' }

type Props = { searchParams: { cat?: string } }

export default async function CategoriesPage({ searchParams }: Props) {
  const supabase = createClient()
  const selectedCat = searchParams.cat

  // Count debates per category
  const { data: allDebates } = await supabase
    .from('debates')
    .select('category')

  const counts = new Map<string, number>()
  allDebates?.forEach(d => counts.set(d.category, (counts.get(d.category) ?? 0) + 1))

  // If a category is selected, fetch debates for it
  let debates: any[] = []
  if (selectedCat) {
    const { data } = await supabase
      .from('debates')
      .select('id, title, category, created_at, argument_count, opening_statement, profiles(username, credibility_score)')
      .eq('category', selectedCat)
      .order('created_at', { ascending: false })
      .limit(20)
    debates = data ?? []
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Categories</h1>
          <p className="text-sm text-zinc-500">Browse debates by topic.</p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={`/categories?cat=${encodeURIComponent(cat)}`}
              className={`card p-4 hover:border-zinc-700 transition-colors ${selectedCat === cat ? 'border-zinc-600 bg-zinc-900' : ''}`}
            >
              <div className="text-sm font-medium text-white mb-1">{cat}</div>
              <div className="text-xs text-zinc-600">
                {counts.get(cat) ?? 0} debate{(counts.get(cat) ?? 0) !== 1 ? 's' : ''}
              </div>
            </Link>
          ))}
        </div>

        {/* Filtered debates */}
        {selectedCat && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-zinc-300">{selectedCat} Debates</h2>
              <Link href="/categories" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                Clear filter
              </Link>
            </div>
            {debates.length === 0 ? (
              <EmptyState
                message={`No debates in ${selectedCat} yet.`}
                sub="Start the first one."
              />
            ) : (
              <div className="space-y-3">
                {debates.map(d => <DebateCard key={d.id} debate={d} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
