-- Registres privés séparés pour les diplômes partenaires.
-- Les lectures publiques passent exclusivement par l'Edge Function verify-diploma.
create extension if not exists pgcrypto;

create table if not exists public.genius_diplomas (
  id uuid primary key default gen_random_uuid(),
  serial_number text not null unique,
  institution text not null default 'GENIUS COLLEGE OF HEALTH SCIENCES, BUSINESS AND TECHNOLOGY',
  holder_name text not null,
  program text,
  issue_year integer,
  status text not null default 'valid' check (status in ('valid','revoked','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bcc_diplomas (
  id uuid primary key default gen_random_uuid(),
  serial_number text not null unique,
  institution text not null default 'BLESSED COSMOPOLITAN COLLEGE UK',
  holder_name text not null,
  program text,
  issue_year integer,
  status text not null default 'valid' check (status in ('valid','revoked','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mjb_diplomas (
  id uuid primary key default gen_random_uuid(),
  serial_number text not null unique,
  institution text not null default 'MJB MANAGEMENT & INTEGRATED SERVICES',
  holder_name text not null,
  program text,
  issue_year integer,
  status text not null default 'valid' check (status in ('valid','revoked','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.genius_diplomas enable row level security;
alter table public.bcc_diplomas enable row level security;
alter table public.mjb_diplomas enable row level security;

revoke all on public.genius_diplomas from anon, authenticated;
revoke all on public.bcc_diplomas from anon, authenticated;
revoke all on public.mjb_diplomas from anon, authenticated;

create index if not exists genius_diplomas_serial_idx on public.genius_diplomas(serial_number);
create index if not exists bcc_diplomas_serial_idx on public.bcc_diplomas(serial_number);
create index if not exists mjb_diplomas_serial_idx on public.mjb_diplomas(serial_number);
