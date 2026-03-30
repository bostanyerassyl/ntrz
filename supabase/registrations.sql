create extension if not exists pgcrypto;

create table if not exists public.user_roles (
  code text primary key,
  title text not null
);

insert into public.user_roles (code, title)
values
  ('student', 'Student'),
  ('teacher', 'Teacher'),
  ('parent', 'Parent'),
  ('admin', 'Admin')
on conflict (code) do update
set title = excluded.title;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  login text not null unique,
  email text not null unique,
  password_hash text not null,
  role text not null default 'student',
  created_at timestamptz not null default now()
);

alter table public.registrations
add column if not exists role text not null default 'student';

update public.registrations
set role = 'student'
where role is null;

alter table public.registrations
drop constraint if exists registrations_role_check;

alter table public.registrations
drop constraint if exists registrations_role_fkey;

alter table public.registrations
add constraint registrations_role_fkey
foreign key (role) references public.user_roles(code);

alter table public.user_roles enable row level security;
alter table public.registrations enable row level security;

drop policy if exists "allow_public_read_user_roles" on public.user_roles;
create policy "allow_public_read_user_roles"
on public.user_roles
for select
to anon, authenticated
using (true);

drop function if exists public.verify_login(text, text);

drop policy if exists "allow_public_insert_registrations" on public.registrations;

create policy "allow_public_insert_registrations"
on public.registrations
for insert
to anon, authenticated
with check (true);

create function public.verify_login(
  input_login text,
  input_password_hash text
)
returns table (
  id uuid,
  login text,
  email text,
  role text,
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
    registrations.role,
    registrations.created_at
  from public.registrations
  where registrations.login = input_login
    and registrations.password_hash = input_password_hash
  limit 1;
$$;

grant execute on function public.verify_login(text, text) to anon, authenticated;
