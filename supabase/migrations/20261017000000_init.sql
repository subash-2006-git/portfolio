-- Portfolio content schema.
-- Visitors (anon) can read published content and submit contact messages.
-- Only users listed in public.admins can change anything.

-- ---------------------------------------------------------------- admins
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
create policy "admins can see their own row" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

create function public.is_admin() returns boolean
  language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create function public.touch_updated_at() returns trigger
  language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------- profile (single row)
create table public.profile (
  id smallint primary key default 1 check (id = 1),
  name text not null,
  handle text not null default '',
  title text not null default '',
  tagline text not null default '',
  email text not null default '',
  github text not null default '',
  linkedin text not null default '',
  photo_url text not null default '',
  resume_url text not null default '',
  about text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- skills
create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  items text[] not null default '{}',
  position integer not null default 0
);

-- ---------------------------------------------------------------- projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  description text not null default '',
  stack text[] not null default '{}',
  repo text not null default '',
  demo text not null default '',
  image_url text not null default '',
  year text not null default '',
  role text not null default '',
  problem text not null default '',
  approach text[] not null default '{}',
  outcome text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- At most one featured project.
create unique index projects_single_featured on public.projects (featured) where featured;

-- ---------------------------------------------------------------- experience
create table public.experience (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'work' check (kind in ('work', 'education')),
  role text not null,
  org text not null,
  period text not null default '',
  location text not null default '',
  summary text not null default '',
  highlights text[] not null default '{}',
  published boolean not null default true,
  position integer not null default 0
);

-- ---------------------------------------------------------------- blog posts
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  date date not null default current_date,
  summary text not null default '',
  content text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- contact messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  message text not null check (char_length(message) between 1 and 5000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create trigger profile_touch before update on public.profile for each row execute function public.touch_updated_at();
create trigger projects_touch before update on public.projects for each row execute function public.touch_updated_at();
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------- row level security
alter table public.profile enable row level security;
alter table public.skill_groups enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.posts enable row level security;
alter table public.messages enable row level security;

create policy "public read" on public.profile for select to anon, authenticated using (true);
create policy "public read" on public.skill_groups for select to anon, authenticated using (true);
create policy "public read published" on public.projects for select to anon, authenticated using (published or (select public.is_admin()));
create policy "public read published" on public.experience for select to anon, authenticated using (published or (select public.is_admin()));
create policy "public read published" on public.posts for select to anon, authenticated using (published or (select public.is_admin()));

create policy "admin insert" on public.profile for insert to authenticated with check ((select public.is_admin()));
create policy "admin update" on public.profile for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admin write" on public.skill_groups for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin write" on public.projects for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin write" on public.experience for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin write" on public.posts for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Anyone may send a message; only admins can read or manage them.
create policy "anyone can send" on public.messages for insert to anon, authenticated with check (read = false);
create policy "admin read" on public.messages for select to authenticated using ((select public.is_admin()));
create policy "admin update" on public.messages for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin delete" on public.messages for delete to authenticated using ((select public.is_admin()));

-- ---------------------------------------------------------------- media storage
-- Public bucket: files are readable by URL; only admins can upload, replace or delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml', 'application/pdf']
);

create policy "admin read media" on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
create policy "admin upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admin update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
create policy "admin delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
