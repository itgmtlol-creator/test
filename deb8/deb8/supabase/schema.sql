-- ============================================================
-- DEB8 — FULL SUPABASE SCHEMA
-- Paste this entire file into: Supabase → SQL Editor → New query → Run
-- ============================================================

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  email       text not null,
  bio         text,
  credibility_score integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Index for fast username lookups
create index if not exists profiles_username_idx on public.profiles(username);

-- ============================================================
-- 2. DEBATES TABLE
-- ============================================================
create table if not exists public.debates (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  category           text not null,
  author_id          uuid not null references public.profiles(id) on delete cascade,
  opening_statement  text,
  argument_count     integer not null default 0,
  created_at         timestamptz not null default now()
);

create index if not exists debates_author_idx on public.debates(author_id);
create index if not exists debates_category_idx on public.debates(category);
create index if not exists debates_created_idx on public.debates(created_at desc);

-- ============================================================
-- 3. ARGUMENTS TABLE
-- ============================================================
create table if not exists public.arguments (
  id          uuid primary key default gen_random_uuid(),
  debate_id   uuid not null references public.debates(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  parent_id   uuid references public.arguments(id) on delete cascade,
  content     text not null,
  tag         text not null check (tag in ('OPENING', 'C', 'E', 'R', 'S')),
  created_at  timestamptz not null default now()
);

create index if not exists arguments_debate_idx on public.arguments(debate_id);
create index if not exists arguments_author_idx on public.arguments(author_id);
create index if not exists arguments_parent_idx on public.arguments(parent_id);

-- ============================================================
-- 4. TRIGGER: auto-increment argument_count on debates
-- ============================================================
create or replace function public.increment_debate_argument_count()
returns trigger as $$
begin
  if NEW.tag != 'OPENING' then
    update public.debates
    set argument_count = argument_count + 1
    where id = NEW.debate_id;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists on_argument_insert on public.arguments;
create trigger on_argument_insert
  after insert on public.arguments
  for each row execute function public.increment_debate_argument_count();

-- ============================================================
-- 5. FUNCTION: increment_credibility (called from app)
-- ============================================================
create or replace function public.increment_credibility(user_id uuid, amount integer)
returns void as $$
begin
  update public.profiles
  set credibility_score = credibility_score + amount
  where id = user_id;
end;
$$ language plpgsql security definer;

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.debates enable row level security;
alter table public.arguments enable row level security;

-- -------- PROFILES --------
-- Anyone can read profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Users can insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- -------- DEBATES --------
-- Anyone can read debates
create policy "Debates are publicly viewable"
  on public.debates for select
  using (true);

-- Authenticated users can create debates
create policy "Authenticated users can create debates"
  on public.debates for insert
  with check (auth.uid() = author_id);

-- Authors can update their own debates
create policy "Authors can update their debates"
  on public.debates for update
  using (auth.uid() = author_id);

-- Authors can delete their own debates
create policy "Authors can delete their debates"
  on public.debates for delete
  using (auth.uid() = author_id);

-- -------- ARGUMENTS --------
-- Anyone can read arguments
create policy "Arguments are publicly viewable"
  on public.arguments for select
  using (true);

-- Authenticated users can insert arguments
create policy "Authenticated users can post arguments"
  on public.arguments for insert
  with check (auth.uid() = author_id);

-- Authors can update their own arguments
create policy "Authors can update their arguments"
  on public.arguments for update
  using (auth.uid() = author_id);

-- Authors can delete their own arguments
create policy "Authors can delete their arguments"
  on public.arguments for delete
  using (auth.uid() = author_id);

-- ============================================================
-- 7. SEED DATA (optional — delete if you don't want sample data)
-- ============================================================
-- To seed, you'd need a real auth user. Skip seeding for now.
-- Once you register your first user, debates will appear naturally.

-- ============================================================
-- DONE. Your DEB8 schema is ready.
-- ============================================================
