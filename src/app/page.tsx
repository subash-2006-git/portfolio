import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import ContactForm from "@/components/ContactForm";
import { site, projects } from "@/data/site";
import { getPosts } from "@/lib/posts";

export default function Home() {
  const posts = getPosts().slice(0, 3);
  return (
    <>
      <section className="pt-10">
        <p className="text-sm text-dim"><span className="text-accent">$</span> whoami</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-5xl">{site.name}</h1>
        <p className="cursor mt-3 text-lg text-accent">{site.title}. {site.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a href="#projects" className="rounded border border-accent px-4 py-2 text-accent hover:bg-accent hover:text-bg">view projects</a>
          <a href={site.resume} className="rounded border border-line px-4 py-2 hover:border-accent">resume.pdf</a>
        </div>
      </section>

      <Section id="about" cmd="cat about.md">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Image
            src={site.photo}
            alt={`Photo of ${site.name}`}
            width={160}
            height={160}
            unoptimized
            className="h-40 w-40 shrink-0 rounded border border-line object-cover"
          />
          <div>
            {site.about.map((p, i) => (
              <p key={i} className="mb-3 leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
        <dl className="mt-6 space-y-2 text-sm">
          {Object.entries(site.skills).map(([k, v]) => (
            <div key={k} className="flex gap-3">
              <dt className="w-24 shrink-0 text-dim">{k}</dt>
              <dd>{v.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="projects" cmd="ls projects/">
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
      </Section>

      <Section id="blog" cmd="tail blog/">
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="text-accent hover:underline">{p.title}</Link>
              <span className="ml-3 text-xs text-dim">{p.date}</span>
            </li>
          ))}
        </ul>
        <Link href="/blog" className="mt-4 inline-block text-sm text-dim hover:text-accent">all posts →</Link>
      </Section>

      <Section id="contact" cmd="./contact.sh">
        <p className="mb-4 text-sm text-dim">
          Or reach me at <a className="underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a> ·{" "}
          <a className="underline hover:text-accent" href={site.github} target="_blank" rel="noreferrer">github</a> ·{" "}
          <a className="underline hover:text-accent" href={site.linkedin} target="_blank" rel="noreferrer">linkedin</a>
        </p>
        <ContactForm />
      </Section>
    </>
  );
}
