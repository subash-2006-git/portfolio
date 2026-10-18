// Creates (or promotes) an admin account for /admin.
// Usage: npm run admin:create -- you@example.com "a-strong-password"
// Public signups are disabled in supabase/config.toml, so this is the only way in.
import { createClient } from "@supabase/supabase-js";

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: npm run admin:create -- you@example.com "a-strong-password"');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Use a password with at least 8 characters.");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local. Run `npx supabase status` to see them.");
  process.exit(1);
}

const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

async function findUser(address) {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === address.toLowerCase());
    if (hit || data.users.length < 200) return hit;
  }
}

let user = await findUser(email);
if (user) {
  const { error } = await supabase.auth.admin.updateUserById(user.id, { password });
  if (error) throw error;
  console.log(`Found existing user ${email}; password updated.`);
} else {
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  user = data.user;
  console.log(`Created user ${email}.`);
}

const { error } = await supabase.from("admins").upsert({ user_id: user.id });
if (error) throw error;
console.log(`${email} is now an admin. Sign in at http://localhost:3100/admin`);
