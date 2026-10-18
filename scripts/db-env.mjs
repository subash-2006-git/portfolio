// Fills .env.local with the running local Supabase's URL and keys.
// Usage: npm run db:env   (Supabase must be running: npm run db:start)
// Only the Supabase variables (and MAILPIT_URL) are touched; anything else in .env.local is kept.
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const FILE = ".env.local";

let status;
try {
  const out = execSync("npx supabase status -o json", { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  status = JSON.parse(out.slice(out.indexOf("{"), out.lastIndexOf("}") + 1));
} catch {
  console.error("Couldn't read Supabase status. Is Docker running and Supabase started? Try: npm run db:start");
  process.exit(1);
}

const values = {
  NEXT_PUBLIC_SUPABASE_URL: status.API_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: status.PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY: status.SECRET_KEY,
};
// Local test inbox for "new message" emails. Optional: older CLIs call it INBUCKET_URL.
const optional = { MAILPIT_URL: status.MAILPIT_URL ?? status.INBUCKET_URL };
const missing = Object.entries(values).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  console.error(`Supabase status is missing values for: ${missing.join(", ")}. Update the Supabase CLI and try again.`);
  process.exit(1);
}

const existing = existsSync(FILE) ? readFileSync(FILE, "utf8") : "";
const lines = existing ? existing.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n") : [];
const changed = [];
const added = [];

for (const [key, value] of Object.entries({ ...values, ...optional })) {
  if (!value) continue;
  const i = lines.findIndex((l) => l.trim().startsWith(`${key}=`));
  if (i === -1) {
    lines.push(`${key}=${value}`);
    added.push(key);
  } else if (lines[i] !== `${key}=${value}`) {
    lines[i] = `${key}=${value}`;
    changed.push(key);
  }
}

if (!existing) lines.unshift("# Local Supabase. Regenerate with: npm run db:env");
writeFileSync(FILE, lines.join("\n") + "\n");

if (!changed.length && !added.length) console.log(`${FILE} is already up to date.`);
else {
  if (added.length) console.log(`Added to ${FILE}: ${added.join(", ")}`);
  if (changed.length) console.log(`Updated in ${FILE}: ${changed.join(", ")}`);
}
console.log(`Supabase API: ${values.NEXT_PUBLIC_SUPABASE_URL}`);
if (changed.length || added.length) console.log("Restart `npm run dev` if it's running so it picks up the new values.");
