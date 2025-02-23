-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create products table
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  price integer not null, -- Store price in cents
  image_url text,
  category text not null,
  sizes text[] not null default '{}',
  tags text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create collections table
create table collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create collection_products junction table
create table collection_products (
  collection_id uuid references collections(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (collection_id, product_id)
);

-- Create admin_users table
create table admin_users (
  id uuid primary key references auth.users on delete cascade,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table products enable row level security;
alter table collections enable row level security;
alter table collection_products enable row level security;
alter table admin_users enable row level security;

-- Create policies
create policy "Products are viewable by everyone" on products
  for select using (true);

create policy "Products are editable by admin users only" on products
  for all using (
    auth.uid() in (select id from admin_users)
  );

create policy "Collections are viewable by everyone" on collections
  for select using (true);

create policy "Collections are editable by admin users only" on collections
  for all using (
    auth.uid() in (select id from admin_users)
  );

create policy "Collection products are viewable by everyone" on collection_products
  for select using (true);

create policy "Collection products are editable by admin users only" on collection_products
  for all using (
    auth.uid() in (select id from admin_users)
  );

create policy "Admin users are viewable by admin users only" on admin_users
  for select using (
    auth.uid() in (select id from admin_users)
  );

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();

create trigger update_collections_updated_at
  before update on collections
  for each row
  execute function update_updated_at_column(); 