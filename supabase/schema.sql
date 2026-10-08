-- ==============================================================================
-- MANA SATHULURU - SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Click "Run"
-- ==============================================================================

-- 1. Create table for private contact form messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread', -- 'unread', 'read', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone (anon users) to submit a message
DROP POLICY IF EXISTS "Allow anonymous message inserts" ON public.contact_messages;
CREATE POLICY "Allow anonymous message inserts"
    ON public.contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        char_length(name) > 0 AND
        char_length(contact_info) > 0 AND
        char_length(message) > 0
    );

-- 4. Policy: Strict privacy - Only authenticated dashboard admins can read messages
DROP POLICY IF EXISTS "Disallow public message reads" ON public.contact_messages;
CREATE POLICY "Only authenticated users can view messages"
    ON public.contact_messages
    FOR SELECT
    TO authenticated
    USING (true);

-- 5. Policy: Only authenticated users can update or delete messages
DROP POLICY IF EXISTS "Only authenticated users can update messages" ON public.contact_messages;
CREATE POLICY "Only authenticated users can update messages"
    ON public.contact_messages
    FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Only authenticated users can delete messages" ON public.contact_messages;
CREATE POLICY "Only authenticated users can delete messages"
    ON public.contact_messages
    FOR DELETE
    TO authenticated
    USING (true);

-- ==============================================================================
-- 6. COMMUNITY CONTRIBUTIONS & REAL-TIME PAYMENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payer_name TEXT NOT NULL,
    contact_info TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    upi_ref_id TEXT, -- 12-digit UTR or Gateway Payment ID
    payment_method TEXT DEFAULT 'UPI_QR',
    status TEXT NOT NULL DEFAULT 'completed', -- 'completed', 'pending_verification'
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to record a payment / contribution
DROP POLICY IF EXISTS "Allow anonymous payment inserts" ON public.contributions;
CREATE POLICY "Allow anonymous payment inserts"
    ON public.contributions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        char_length(payer_name) > 0 AND
        amount > 0
    );

-- Allow authenticated admins to view all payments
DROP POLICY IF EXISTS "Only authenticated users can view contributions" ON public.contributions;
CREATE POLICY "Only authenticated users can view contributions"
    ON public.contributions
    FOR SELECT
    TO authenticated
    USING (true);

-- ==============================================================================
-- 7. Community Stories & Photo Suggestions Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name TEXT NOT NULL,
    contact_info TEXT,
    story_title TEXT NOT NULL,
    story_content TEXT NOT NULL,
    category TEXT DEFAULT 'memories',
    status TEXT DEFAULT 'pending_review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.community_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous community story inserts"
    ON public.community_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Only authenticated users can view community submissions"
    ON public.community_submissions
    FOR SELECT
    TO authenticated
    USING (true);
