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
