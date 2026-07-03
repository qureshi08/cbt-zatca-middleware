-- Team invitations + outbound notification URL.
-- Run this in the Supabase SQL editor of the SAME project the app uses
-- (the one whose ref matches NEXT_PUBLIC_SUPABASE_URL). No foreign keys so it
-- applies cleanly regardless of base-schema order.

create table if not exists invitations (
    id               uuid primary key default gen_random_uuid(),
    organization_id  uuid not null,
    email            text not null,
    invited_by       text,
    status           text not null default 'pending',  -- pending | accepted | revoked
    created_at       timestamptz not null default now()
);
create index if not exists idx_invitations_email on invitations (lower(email), status);
create index if not exists idx_invitations_org on invitations (organization_id, created_at desc);

-- Optional per-tenant callback URL: we POST invoice status changes here (outbound webhooks).
alter table organizations add column if not exists notify_url text;
