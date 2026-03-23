-- Tablas base
create table if not exists public.negocios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nombre text,
  created_at timestamptz not null default now()
);

create table if not exists public.fuentes (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  nombre text not null,
  tipo text not null check (tipo in ('excel', 'pdf', 'sheets')),
  url text not null,
  sheets_id text,
  "pestaña" text,
  created_at timestamptz not null default now()
);

create table if not exists public.estructuras (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  nombre text not null,
  fuente_excel_id uuid not null references public.fuentes(id) on delete restrict,
  fuente_pdf_id uuid references public.fuentes(id) on delete set null,
  prompt_personalizado text not null,
  activa boolean not null default false,
  created_at timestamptz not null default now()
);

-- Trigger para crear negocio al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.negocios (user_id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Políticas RLS
alter table public.negocios enable row level security;
alter table public.fuentes enable row level security;
alter table public.estructuras enable row level security;

create policy "Negocio por owner" on public.negocios
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Fuentes por negocio owner" on public.fuentes
for all using (negocio_id in (select id from public.negocios where user_id = auth.uid()))
with check (negocio_id in (select id from public.negocios where user_id = auth.uid()));

create policy "Estructuras por negocio owner" on public.estructuras
for all using (negocio_id in (select id from public.negocios where user_id = auth.uid()))
with check (negocio_id in (select id from public.negocios where user_id = auth.uid()));
