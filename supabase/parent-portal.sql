drop function if exists public.get_parent_profile(text);

create function public.get_parent_profile(input_login text)
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
    and registrations.role = 'parent'
  limit 1;
$$;

grant execute on function public.get_parent_profile(text) to anon, authenticated;

create table if not exists public.parent_student_links (
  id uuid primary key default gen_random_uuid(),
  parent_login text not null,
  student_login text not null,
  created_at timestamptz not null default now(),
  constraint parent_student_links_unique unique (parent_login, student_login)
);

alter table public.parent_student_links enable row level security;

drop policy if exists "allow_public_read_parent_student_links" on public.parent_student_links;
drop policy if exists "allow_public_insert_parent_student_links" on public.parent_student_links;

create policy "allow_public_read_parent_student_links"
on public.parent_student_links
for select
to anon, authenticated
using (true);

create policy "allow_public_insert_parent_student_links"
on public.parent_student_links
for insert
to anon, authenticated
with check (true);
