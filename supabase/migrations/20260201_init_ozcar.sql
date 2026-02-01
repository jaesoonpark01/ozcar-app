-- Ozcar Ecosystem SQL Schema
-- Path: supabase/migrations/20260201_init_ozcar.sql

-- Enable RLS
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Profiles (Linked to Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'OWNER' CHECK (role IN ('OWNER', 'TECHNICIAN', 'ADMIN')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Technicians
CREATE TABLE IF NOT EXISTS public.technicians (
  id UUID REFERENCES public.profiles(id) PRIMARY KEY,
  shop_name TEXT NOT NULL,
  location TEXT,
  reputation_score INT DEFAULT 85 CHECK (reputation_score BETWEEN 0 AND 100),
  is_certified BOOLEAN DEFAULT FALSE,
  total_jobs INT DEFAULT 0,
  bio TEXT
);

-- 3. Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
  vin TEXT PRIMARY KEY,
  model TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id),
  nft_token_id TEXT UNIQUE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Maintenance Logs (The "Mining" Data)
CREATE TABLE IF NOT EXISTS public.maintenance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vin TEXT REFERENCES public.vehicles(vin) ON DELETE CASCADE,
  technician_id UUID REFERENCES public.technicians(id),
  type TEXT NOT NULL, -- e.g., 'OIL_CHANGE', 'ACCIDENT_REPAIR'
  description TEXT,
  severity TEXT DEFAULT 'NONE' CHECK (severity IN ('NONE', 'LOW', 'MEDIUM', 'HIGH')),
  ipfs_cid TEXT,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Escrow State Machine
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  vin TEXT REFERENCES public.vehicles(vin),
  buyer_id UUID REFERENCES public.profiles(id),
  seller_id UUID REFERENCES public.profiles(id),
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'PAYMENT' CHECK (status IN ('PAYMENT', 'LOGISTICS', 'AUDIT', 'SETTLEMENT')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies Examples
CREATE POLICY "Public profile view" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Technicians can insert logs" ON public.maintenance_logs FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.technicians WHERE id = auth.uid()));

CREATE POLICY "Anyone can view maintenance history" ON public.maintenance_logs FOR SELECT USING (true);
