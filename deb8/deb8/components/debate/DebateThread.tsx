'use client'

import { useState } from 'react'
import ArgumentNode from './ArgumentTree'
import ArgumentForm from './ArgumentForm'
import type { Argument } from '@/lib/utils'

type Props = {
  opening: Argument
  topLevelArgs: Argument[]
  debateId: string
  currentUserId: string | null
}

export default function DebateThread({ opening, topLevelArgs, debateId, currentUserId }: Props) {
  const [args, setArgs] = useState<Argument[]>(topLevelArgs)
  const [showReply, setShowReply] = useState(false)

  const handleNewArg = (newArg: Argument) => {
    setArgs(prev => [{ ...newArg, children: [] }, ...prev])
    setShowReply(false)
  }

  return (
    <div className="space-y-6">
      {/* Opening statement */}
      <div className="card p-6">
        <ArgumentNode
          argument={opening}
          debateId={debateId}
          currentUserId={null}
          depth={0}
        />
      </div>

      {/* Top-level reply CTA */}
      {currentUserId && (
        <div>
          {!showReply ? (
            <button
              onClick={() => setShowReply(true)}
              className="btn-ghost w-full text-center"
            >
              + Add your argument to this debate
            </button>
          ) : (
            <ArgumentForm
              debateId={debateId}
              parentId={null}
              onSuccess={handleNewArg}
              onCancel={() => setShowReply(false)}
            />
          )}
        </div>
      )}

      {!currentUserId && (
        <div className="card p-4 text-center text-sm text-zinc-500">
          <a href="/login" className="underline hover:text-white">Sign in</a> to join this debate.
        </div>
      )}

      {/* Argument threads */}
      <div className="card divide-y divide-zinc-900">
        {args.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm">
            No arguments yet. Be the first.
          </div>
        ) : (
          args.map(arg => (
            <div key={arg.id} className="px-5">
              <ArgumentNode
                argument={arg}
                debateId={debateId}
                currentUserId={currentUserId}
                depth={0}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
