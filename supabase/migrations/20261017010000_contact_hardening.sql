-- Contact messages now go only through the site's server action, which rate-limits by IP
-- and inserts with the secret key. Closing the anon insert path stops bots from skipping
-- the form and writing to the table directly through the public REST API.
drop policy "anyone can send" on public.messages;

-- HMAC of the sender's IP (never the raw address), used only for rate limiting.
alter table public.messages add column ip_hash text;
create index messages_ip_recent on public.messages (ip_hash, created_at desc);
create index messages_recent on public.messages (created_at desc);
