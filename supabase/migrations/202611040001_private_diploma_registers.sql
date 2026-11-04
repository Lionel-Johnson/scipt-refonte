create extension if not exists pgcrypto;
create table if not exists public.partner_diplomas (
 id uuid primary key default gen_random_uuid(), serial_number text not null unique,
 institution text not null, holder_name text not null, program text, issue_year integer,
 status text not null default 'valid' check(status in ('valid','revoked','suspended')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.scipt_gabon_diplomas (
 id uuid primary key default gen_random_uuid(), serial_number text not null unique,
 institution text not null default 'SCIPT INTERNATIONAL', holder_name text not null,
 program text, issue_year integer,
 status text not null default 'valid' check(status in ('valid','revoked','suspended')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.partner_diplomas enable row level security;
alter table public.scipt_gabon_diplomas enable row level security;
revoke all on public.partner_diplomas from anon, authenticated;
revoke all on public.scipt_gabon_diplomas from anon, authenticated;
create index if not exists partner_diplomas_serial_idx on public.partner_diplomas(serial_number);
create index if not exists scipt_gabon_diplomas_serial_idx on public.scipt_gabon_diplomas(serial_number);