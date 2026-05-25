-- ============================================
-- System Design Mastery — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now(),
  last_login_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile; admins can read all
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id or exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Allow insert from trigger (service role)
create policy "Allow insert for authenticated"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Card states (spaced repetition progress)
create table public.card_states (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  concept_id text not null,
  ease_factor real default 2.5,
  interval integer default 0,
  repetitions integer default 0,
  next_review_date date default current_date,
  last_review_date date default current_date,
  total_reviews integer default 0,
  updated_at timestamptz default now(),
  unique (user_id, concept_id)
);

alter table public.card_states enable row level security;

create policy "Users can manage own card states"
  on public.card_states for all
  using (auth.uid() = user_id);

create policy "Admins can read all card states"
  on public.card_states for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

-- 3. Quiz attempts
create table public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  score integer not null,
  total integer not null,
  completed_at timestamptz default now()
);

alter table public.quiz_attempts enable row level security;

create policy "Users can manage own quiz attempts"
  on public.quiz_attempts for all
  using (auth.uid() = user_id);

create policy "Admins can read all quiz attempts"
  on public.quiz_attempts for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

-- 4. Activity log (tracks logins, reviews, quiz completions)
create table public.activity_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  action text not null, -- 'login', 'review', 'quiz_complete', 'concept_view'
  metadata jsonb,
  created_at timestamptz default now()
);

alter table public.activity_log enable row level security;

create policy "Users can insert own activity"
  on public.activity_log for insert
  with check (auth.uid() = user_id);

create policy "Users can read own activity"
  on public.activity_log for select
  using (auth.uid() = user_id);

create policy "Admins can read all activity"
  on public.activity_log for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

-- 5. Indexes for performance
create index idx_card_states_user on public.card_states (user_id);
create index idx_card_states_review on public.card_states (user_id, next_review_date);
create index idx_quiz_attempts_user on public.quiz_attempts (user_id, completed_at desc);
create index idx_activity_log_user on public.activity_log (user_id, created_at desc);
create index idx_activity_log_action on public.activity_log (action, created_at desc);
