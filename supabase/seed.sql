-- Starting content, copied from the old src/data/site.ts and src/content/blog.
-- Runs on `supabase db reset`. Edit everything from /admin afterwards.

insert into public.profile (id, name, handle, title, tagline, email, github, linkedin, photo_url, resume_url, about)
values (
  1, 'Subash S', 'subash', 'Software Developer', 'I build things for the web.',
  'iamsubash2006@gmail.com', 'https://github.com/subash-2006-git', 'https://linkedin.com/in/ssubaz',
  '/profile.jpg', '/resume.pdf',
  array[
    'Hi, I''m Subash, a developer who enjoys turning ideas into clean, fast and useful software.',
    'Replace this with 2-3 sentences about your background, what you''re learning, and what you''re looking for.'
  ]
);

insert into public.skill_groups (name, items, position) values
  ('Languages', array['TypeScript', 'JavaScript', 'Python'], 0),
  ('Frontend', array['React', 'Next.js', 'Tailwind CSS'], 1),
  ('Backend', array['Node.js', 'PostgreSQL', 'REST'], 2),
  ('Tools', array['Git', 'Docker', 'Vercel'], 3);

insert into public.projects (slug, name, description, stack, repo, demo, year, role, problem, approach, outcome, featured, position) values
  (
    'expense-tracker', 'Expense Tracker', 'Personal expense tracker to log spending and see where money goes.',
    array['Next.js', 'TypeScript', 'Tailwind'], 'https://github.com/your-username/expense-tracker', '',
    '2026', 'Solo developer',
    'TODO: What problem were you solving, and for whom? One or two sentences.',
    array[
      'TODO: A key technical decision and why you made it.',
      'TODO: Something tricky you solved along the way.',
      'TODO: How you kept it fast, accessible or easy to use.'
    ],
    array[
      'TODO: A result, ideally with a number (users, load time, time saved).',
      'TODO: What you learned or would do differently.'
    ],
    true, 0
  ),
  (
    'project-two', 'Project Two', 'Placeholder: one line on what it does and why it matters.',
    array['React', 'Node.js'], 'https://github.com/your-username/project-two', 'https://example.com',
    '2026', '', '', '{}', '{}', false, 1
  ),
  (
    'project-three', 'Project Three', 'Placeholder: swap in your best work here.',
    array['Python', 'PostgreSQL'], '', '',
    '2025', '', '', '{}', '{}', false, 2
  );

insert into public.experience (kind, role, org, period, location, summary, highlights, position) values
  (
    'work', 'TODO: Role title (e.g. Web Development Intern)', 'TODO: Company or organisation',
    '2026 – Present', 'Remote', 'TODO: One sentence on what the team does and what you own.',
    array[
      'TODO: An achievement with impact, e.g. "Built X, cutting Y by 30%".',
      'TODO: Another concrete contribution.'
    ],
    0
  ),
  (
    'education', 'TODO: Degree and major', 'TODO: College name',
    '2024 – 2028', '', 'TODO: Relevant coursework, CGPA or activities.', '{}', 1
  );

insert into public.posts (slug, title, date, summary, content, published) values
  (
    'hello-world', 'Hello, world', '2026-09-30', 'Why I started this blog and what I''ll write about.',
    E'Welcome! This is my first post. Posts are written in Markdown from the admin panel.\n\n- Give each post a title, date and summary\n- The slug becomes the URL\n\n```ts\nconsole.log("hello, world");\n```\n',
    true
  );
