export default function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="text-xs font-mono px-2 py-0.5 rounded border border-zinc-800 text-zinc-500 bg-zinc-900">
      {category}
    </span>
  )
}
