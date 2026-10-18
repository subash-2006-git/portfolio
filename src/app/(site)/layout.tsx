import Nav from "@/components/Nav";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/Icons";
import PreviewBar from "@/components/PreviewBar";
import { getProfile, isPreview } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, preview] = await Promise.all([getProfile(), isPreview()]);
  return (
    <>
      {preview && <PreviewBar />}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-fg">
        Skip to content
      </a>
      <Nav name={profile.name} />
      <main id="main" className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 text-sm text-dim sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <div className="flex gap-1">
            {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-md p-2 hover:bg-muted hover:text-fg"><GitHubIcon /></a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-md p-2 hover:bg-muted hover:text-fg"><LinkedInIcon /></a>}
            {profile.email && <a href={`mailto:${profile.email}`} aria-label="Email" className="rounded-md p-2 hover:bg-muted hover:text-fg"><MailIcon /></a>}
          </div>
        </div>
      </footer>
    </>
  );
}
