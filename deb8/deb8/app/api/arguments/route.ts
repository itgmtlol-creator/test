import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CREDIBILITY_REWARDS } from '@/lib/constants'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { debate_id, parent_id, content, tag } = body

  if (!debate_id || !content?.trim() || !tag) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const validTags = ['C', 'E', 'R', 'S']
  if (!validTags.includes(tag)) {
    return NextResponse.json({ error: 'Invalid tag' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('arguments')
    .insert({
      debate_id,
      author_id: user.id,
      parent_id: parent_id ?? null,
      content: content.trim(),
      tag,
    })
    .select('*, profiles(username, credibility_score)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Award credibility
  const reward = tag === 'E' ? CREDIBILITY_REWARDS.POST_EVIDENCE : CREDIBILITY_REWARDS.POST_ARGUMENT
  await supabase.rpc('increment_credibility', { user_id: user.id, amount: reward })

  return NextResponse.json({ argument: data })
}
