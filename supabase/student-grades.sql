create extension if not exists pgcrypto;

create table if not exists public.student_grades (
  id uuid primary key default gen_random_uuid(),
  student_login text not null,
  student_email text,
  student_role text not null default 'student',
  class_name text,
  kundelik_person_id bigint,
  kundelik_school_id bigint,
  kundelik_group_id bigint,
  kundelik_subject_id bigint,
  kundelik_lesson_id bigint,
  kundelik_work_id bigint,
  subject_name text,
  lesson_name text,
  mark_value text,
  mark_numeric numeric,
  mark_date date,
  raw_payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.student_grades
add column if not exists class_name text;

alter table public.student_grades enable row level security;

drop policy if exists "allow_public_insert_student_grades" on public.student_grades;
drop policy if exists "allow_public_read_student_grades" on public.student_grades;

create policy "allow_public_insert_student_grades"
on public.student_grades
for insert
to anon, authenticated
with check (true);

create policy "allow_public_read_student_grades"
on public.student_grades
for select
to anon, authenticated
using (true);
