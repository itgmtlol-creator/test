export default function EmptyState({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-zinc-500 text-sm">{message}</p>
      {sub && <p className="text-zinc-700 text-xs mt-1">{sub}</p>}
    </div>
  )
}
