drop function if exists public.get_teacher_profile(text);

create function public.get_teacher_profile(input_login text)
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
    and registrations.role = 'teacher'
  limit 1;
$$;

grant execute on function public.get_teacher_profile(text) to anon, authenticated;

create table if not exists public.teacher_subject_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_login text not null,
  teacher_name text not null,
  subject_name text not null,
  class_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.teacher_schedules (
  id uuid primary key default gen_random_uuid(),
  lesson_date date not null,
  start_time time not null,
  end_time time not null,
  teacher_login text,
  teacher_name text not null,
  subject_name text not null,
  class_name text not null,
  classroom text,
  created_at timestamptz not null default now()
);

alter table public.teacher_schedules
add column if not exists teacher_login text;

alter table public.teacher_subject_assignments enable row level security;
alter table public.teacher_schedules enable row level security;

drop policy if exists "allow_public_read_teacher_subject_assignments" on public.teacher_subject_assignments;
drop policy if exists "allow_public_insert_teacher_subject_assignments" on public.teacher_subject_assignments;
drop policy if exists "allow_public_read_teacher_schedules" on public.teacher_schedules;
drop policy if exists "allow_public_insert_teacher_schedules" on public.teacher_schedules;

create policy "allow_public_read_teacher_subject_assignments"
on public.teacher_subject_assignments
for select
to anon, authenticated
using (true);

create policy "allow_public_insert_teacher_subject_assignments"
on public.teacher_subject_assignments
for insert
to anon, authenticated
with check (true);

create policy "allow_public_read_teacher_schedules"
on public.teacher_schedules
for select
to anon, authenticated
using (true);

create policy "allow_public_insert_teacher_schedules"
on public.teacher_schedules
for insert
to anon, authenticated
with check (true);
