-- supabase/migrations/XXXXXXXXXXXXXX_init_schema.sql

-- Perfil de cada usuario (se crea junto con su cuenta de auth)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  cefr_level_estimate text not null default 'A1',
  created_at timestamptz not null default now()
);

-- Vocabulario, frases y estructuras gramaticales gestionadas por el motor SRS
create table public.learning_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('word', 'phrase', 'grammar')),
  target_text text not null,
  translation text,
  frequency_rank integer,
  fsrs_stability double precision not null default 0,
  fsrs_difficulty double precision not null default 0,
  fsrs_state text not null default 'new' check (fsrs_state in ('new','learning','review','relearning')),
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index learning_items_due_idx on public.learning_items (user_id, due_at);

-- Biblioteca de lecturas/audios graduados (contenido compartido, no por usuario)
create table public.reading_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text not null check (level in ('A1','A2','B1','B2','C1','C2')),
  body text not null,
  audio_url text,
  topic text,
  target_vocabulary text[],
  comprehension_questions jsonb,
  created_at timestamptz not null default now()
);

-- Cada sesión de estudio completada
create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer,
  items_reviewed integer default 0,
  reading_id uuid references public.reading_content(id),
  comprehension_score numeric,
  created_at timestamptz not null default now()
);

-- Grabaciones/escritos del usuario y su retroalimentación
create table public.production_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.study_sessions(id) on delete cascade,
  type text not null check (type in ('speaking','writing')),
  transcript text,
  feedback jsonb,
  created_at timestamptz not null default now()
);

-- Metas personales definidas por el propio usuario
create table public.personal_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  topic_focus text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Historial de nivel CEFR estimado, para mostrar tendencia en el panel de progreso
create table public.cefr_estimates_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  estimated_level text not null check (estimated_level in ('A1','A2','B1','B2','C1','C2')),
  estimated_at timestamptz not null default now()
);

-- ── Seguridad a nivel de fila (RLS): cada usuario solo ve y edita sus propios datos ──
alter table public.profiles enable row level security;
alter table public.learning_items enable row level security;
alter table public.study_sessions enable row level security;
alter table public.production_records enable row level security;
alter table public.personal_goals enable row level security;
alter table public.cefr_estimates_history enable row level security;
alter table public.reading_content enable row level security;

create policy "select own profile" on public.profiles for select using (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "manage own items" on public.learning_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "manage own sessions" on public.study_sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "manage own production" on public.production_records for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "manage own goals" on public.personal_goals for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "manage own cefr history" on public.cefr_estimates_history for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- El contenido de lectura es compartido: cualquier usuario autenticado puede leerlo
create policy "authenticated users can read content" on public.reading_content
  for select using (auth.role() = 'authenticated');

-- Crea automáticamente el perfil cuando alguien se registra
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();