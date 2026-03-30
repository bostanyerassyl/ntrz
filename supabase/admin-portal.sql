drop function if exists public.get_admin_profile(text);

create function public.get_admin_profile(input_login text)
returns table (
  login text,
  email text,
  role text,
  password_hash text
)
language sql
security definer
set search_path = public
as $$
  select
    registrations.login,
    registrations.email,
    registrations.role,
    registrations.password_hash
  from public.registrations
  where registrations.login = input_login
    and registrations.role = 'admin'
  limit 1;
$$;

grant execute on function public.get_admin_profile(text) to anon, authenticated;

create table if not exists public.school_news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_published boolean not null default false,
  created_by_login text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.school_news enable row level security;

drop policy if exists "allow_public_read_school_news" on public.school_news;
drop policy if exists "allow_public_insert_school_news" on public.school_news;
drop policy if exists "allow_public_update_school_news" on public.school_news;

create policy "allow_public_read_school_news"
on public.school_news
for select
to anon, authenticated
using (true);

create policy "allow_public_insert_school_news"
on public.school_news
for insert
to anon, authenticated
with check (true);

create policy "allow_public_update_school_news"
on public.school_news
for update
to anon, authenticated
using (true)
with check (true);
