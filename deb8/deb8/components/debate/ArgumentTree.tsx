'use client'

import { useState } from 'react'
import { timeAgo, type Argument } from '@/lib/utils'
import TagBadge from '@/components/ui/TagBadge'
import CredibilityBadge from '@/components/ui/CredibilityBadge'
import ArgumentForm from './ArgumentForm'
import Link from 'next/link'

type Props = {
  argument: Argument
  debateId: string
  currentUserId: string | null
  depth?: number
}

export default function ArgumentNode({ argument, debateId, currentUserId, depth = 0 }: Props) {
  const [showReply, setShowReply] = useState(false)
  const [children, setChildren] = useState<Argument[]>(argument.children ?? [])

  const handleNewArgument = (newArg: Argument) => {
    setChildren(prev => [...prev, { ...newArg, children: [] }])
    setShowReply(false)
  }

  const isOpening = argument.tag === 'OPENING'
  const indent = Math.min(depth, 5)

  return (
    <div
      className={`relative ${indent > 0 ? 'pl-4 border-l border-zinc-800' : ''}`}
      style={{ marginLeft: indent > 0 ? `${indent * 8}px` : 0 }}
    >
      <div className={`py-4 ${!isOpening ? 'border-b border-zinc-900' : ''}`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <TagBadge tag={argument.tag} />
          <Link
            href={`/profile/${argument.profiles?.username}`}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            @{argument.profiles?.username ?? 'unknown'}
          </Link>
          {argument.profiles && (
            <CredibilityBadge score={argument.profiles.credibility_score} />
          )}
          <span className="text-xs text-zinc-700 ml-auto">{timeAgo(argument.created_at)}</span>
        </div>

        {/* Content */}
        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {argument.content}
        </p>

        {/* Actions */}
        {currentUserId && !isOpening && (
          <button
            onClick={() => setShowReply(v => !v)}
            className="mt-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            {showReply ? 'Cancel' : '↳ Reply'}
          </button>
        )}

        {/* Reply form */}
        {showReply && currentUserId && (
          <div className="mt-3">
            <ArgumentForm
              debateId={debateId}
              parentId={argument.id}
              onSuccess={handleNewArgument}
              onCancel={() => setShowReply(false)}
            />
          </div>
        )}
      </div>

      {/* Children */}
      {children.length > 0 && (
        <div className="mt-1">
          {children.map(child => (
            <ArgumentNode
              key={child.id}
              argument={child}
              debateId={debateId}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
