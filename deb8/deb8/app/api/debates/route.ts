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
  const { title, category, opening_statement } = body

  if (!title?.trim() || !category || !opening_statement?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: debate, error: debateError } = await supabase
    .from('debates')
    .insert({
      title: title.trim(),
      category,
      author_id: user.id,
      opening_statement: opening_statement.trim(),
      argument_count: 0,
    })
    .select('id')
    .single()

  if (debateError) {
    return NextResponse.json({ error: debateError.message }, { status: 500 })
  }

  // Create the opening argument
  await supabase.from('arguments').insert({
    debate_id: debate.id,
    author_id: user.id,
    parent_id: null,
    content: opening_statement.trim(),
    tag: 'OPENING',
  })

  // Award credibility
  await supabase.rpc('increment_credibility', {
    user_id: user.id,
    amount: CREDIBILITY_REWARDS.START_DEBATE,
  })

  return NextResponse.json({ debate })
}
