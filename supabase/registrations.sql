create extension if not exists pgcrypto;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  login text not null unique,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;

create policy "allow_public_insert_registrations"
on public.registrations
for insert
to anon, authenticated
with check (true);

create or replace function public.verify_login(
  input_login text,
  input_password_hash text
)
returns table (
  id uuid,
  login text,
  email text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    registrations.id,
    registrations.login,
    registrations.email,
    registrations.created_at
  from public.registrations
  where registrations.login = input_login
    and registrations.password_hash = input_password_hash
  limit 1;
$$;

grant execute on function public.verify_login(text, text) to anon, authenticated;
