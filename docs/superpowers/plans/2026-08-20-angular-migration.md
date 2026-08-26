# Angular v22 + Tailwind v4 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Vite + React 19 portfolio with a pixel/behavior-identical Angular v22 + Tailwind v4 SSG app, in the same repo, at the repo root — preserving every animation, layout, and navigation behavior exactly.

**Architecture:** Standalone Angular components (no NgModules), page-based folder structure mirroring the current React layout, Tailwind v4 via its PostCSS integration with the same `@theme` tokens, static prerendering for all routes (including `projects/:slug` via Angular's Server Routes API), signal-based component state throughout, no test framework, ESLint + angular-eslint for linting.

**Tech Stack:** Angular CLI (esbuild application builder), `@angular/router` (standalone `provideRouter`), `@angular/ssr` (Server Routes / prerendering), Tailwind CSS v4 (`@tailwindcss/postcss`), TypeScript, ESLint + `angular-eslint`.

**Spec:** `docs/superpowers/specs/2026-08-20-angular-migration-design.md`

## Global Constraints

- **Pixel/behavior parity is the bar.** No new visual design, no content changes — every string, color, spacing value, and animation timing carries over exactly as it exists in `_react-backup/` (created in Task 1).
- **No `@angular/animations` package.** All motion is plain CSS (transitions/keyframes, ported verbatim into `src/styles.css`) plus the `appReveal` directive's `IntersectionObserver` — never Angular's animation trigger DSL.
- **Standalone components only.** No `NgModule` anywhere in the app.
- **No per-component CSS files.** Styling is Tailwind utility classes directly in templates plus the one global `src/styles.css` — matching the current project's convention of zero per-page CSS files.
- **No test framework.** No `.spec.ts` files; any test scaffolding `ng new` generates gets removed in Task 2.
- **SSG rendering.** Every route (including each `projects/:slug`) must prerender to static HTML. Any browser-only API must be guarded so the prerender build never crashes and never ships permanently-hidden (`opacity: 0`) content.
- **`_react-backup/` and the `pre-angular-migration` git tag are never deleted by any task in this plan.** Cleanup happens only when Amit explicitly asks for it, after this plan is fully executed and verified.
- **Modern Angular signal APIs throughout:** `input()`/`computed()`/`signal()`, the `@if`/`@for` control-flow syntax — not `@Input()` decorators, not `*ngIf`/`*ngFor`.
- Icon usage takes an `extraClass` input (not `class`) on `<app-icon>` — Angular reserves the literal `class` attribute for host-binding, so it cannot be re-purposed as a component `@Input`. Every call site in this plan already uses `extraClass`.

---

## Task 1: Backup the React app

**Files:**
- Create: `_react-backup/` (copy of the current app)
- No test framework — this task's "test" is a diff check confirming the backup is byte-identical to the source.

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `_react-backup/src/`, `_react-backup/index.html`, `_react-backup/vite.config.js`, `_react-backup/package.json`, `_react-backup/package-lock.json`, `_react-backup/.oxlintrc.json`, `_react-backup/public/` — a full, working copy of the current React app, plus a `pre-angular-migration` git tag on the current commit. Every later task relies on this folder existing as the ground-truth reference for "what does this look/animate like today."

- [ ] **Step 1: Copy the current app into `_react-backup/`**

```bash
cd /home/amit/projects/personal/portfolio-react
mkdir -p _react-backup
cp -r src index.html vite.config.js package.json package-lock.json .oxlintrc.json public _react-backup/
```

- [ ] **Step 2: Verify the backup is identical to the source**

```bash
diff -r src _react-backup/src
diff index.html _react-backup/index.html
diff vite.config.js _react-backup/vite.config.js
diff package.json _react-backup/package.json
```

Expected: no output from any `diff` (identical).

- [ ] **Step 3: Tag the current commit and commit the backup**

```bash
git tag pre-angular-migration
git add _react-backup
git commit -m "Back up React app to _react-backup/ before Angular migration"
git status --short
```

Expected: working tree clean after the commit; `git tag` lists `pre-angular-migration`.

---

## Task 2: Scaffold the Angular workspace and remove test scaffolding

**Files:**
- Delete: `src/`, `index.html`, `vite.config.js`, `package.json`, `package-lock.json`, `.oxlintrc.json`, `node_modules/`, `dist/` (all safely preserved in `_react-backup/` from Task 1)
- Create: everything a fresh `ng new` workspace produces, merged into the repo root — `src/main.ts`, `src/main.server.ts`, `src/server.ts`, `src/app/app.component.ts`/`.html`, `src/app/app.config.ts`, `src/app/app.config.server.ts`, `src/app/app.routes.ts`, `angular.json`, `tsconfig*.json`, `package.json`, `public/favicon.ico` (merged alongside the existing `public/favicon.svg`)
- Delete (post-scaffold cleanup): any `*.spec.ts` files, `src/app/app.component.spec.ts`, test-related devDependencies

**Interfaces:**
- Consumes: nothing new — this is pure scaffolding.
- Produces: a buildable, runnable, empty-shell Angular workspace at the repo root. Every subsequent task modifies files this task creates (`app.component.ts`, `app.routes.ts`, `app.config.ts`, `app.config.server.ts`, `src/styles.css`, `public/`).

- [ ] **Step 1: Remove the old React root files (already safe in `_react-backup/`)**

```bash
cd /home/amit/projects/personal/portfolio-react
rm -rf src index.html vite.config.js package.json package-lock.json .oxlintrc.json node_modules dist
```

- [ ] **Step 2: Scaffold a fresh Angular workspace in a sibling temp directory**

```bash
cd /home/amit/projects/personal
npx -y @angular/cli@latest new portfolio-react-ng-scaffold \
  --directory=portfolio-react-ng-scaffold \
  --routing \
  --style=css \
  --ssr \
  --skip-git \
  --package-manager=npm \
  --defaults
```

If the CLI still prompts interactively despite `--defaults` (exact prompts vary by installed CLI version): choose zoneless change detection if offered (either answer works for this app — it has no code that depends on zone.js), confirm SSR/prerendering if asked again, and decline any optional AI-tooling integration prompt.

- [ ] **Step 3: Merge the scaffold into the repo root**

```bash
cd /home/amit/projects/personal

# Merge public/ contents — keep our existing public/favicon.svg, add whatever
# Angular generated (e.g. favicon.ico) alongside it without overwriting.
cp -n portfolio-react-ng-scaffold/public/* portfolio-react/public/ 2>/dev/null || true

# Move every other top-level scaffolded item (visible and dotfiles) into the repo root.
cd portfolio-react-ng-scaffold
for item in * .*; do
  case "$item" in
    "."|".."|".git"|"public") continue ;;
  esac
  if [ -e "$item" ]; then
    mv "$item" ../portfolio-react/
  fi
done
cd ..
rm -rf portfolio-react-ng-scaffold
```

- [ ] **Step 4: Remove test scaffolding**

```bash
cd /home/amit/projects/personal/portfolio-react
find src -name "*.spec.ts" -delete
```

Open `package.json` and:
- Remove the `"test": "ng test"` script line.
- Remove `jasmine-core`, `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`, and `@types/jasmine` from `devDependencies` if present.

Open `angular.json` and remove the `"test"` builder target under the project's `architect` section if present (its schematic is `@angular/build:karma` or similar).

- [ ] **Step 5: Install dependencies and verify the empty shell builds and serves**

```bash
cd /home/amit/projects/personal/portfolio-react
npm install
npm start
```

Expected: dev server starts without error; visiting the printed local URL shows the default Angular welcome page. Stop the server (Ctrl+C).

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Angular workspace at repo root, remove test scaffolding"
```

---

## Task 3: ESLint + angular-eslint setup

**Files:**
- Create/Modify: `eslint.config.js` (or whatever config file `ng add @angular-eslint/schematics` generates for the installed CLI version), `package.json` (adds `lint` script + devDependencies)

**Interfaces:**
- Consumes: the scaffolded workspace from Task 2.
- Produces: a working `npm run lint` command every later task's commit step runs.

- [ ] **Step 1: Add angular-eslint**

```bash
cd /home/amit/projects/personal/portfolio-react
npx -y ng add @angular-eslint/schematics --skip-confirmation
```

- [ ] **Step 2: Verify lint runs clean on the empty shell**

```bash
npm run lint
```

Expected: exits 0 with no errors (the scaffold's default generated files pass angular-eslint's default rule set).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add ESLint + angular-eslint"
```

---

## Task 4: Tailwind v4 integration, global styles, fonts, favicon

**Files:**
- Create: `.postcssrc.json`
- Modify: `src/styles.css` (replace generated content entirely), `src/index.html` (head content), `package.json` (add `tailwindcss` + `@tailwindcss/postcss` devDependencies)

**Interfaces:**
- Consumes: the scaffolded workspace (Task 2), lint setup (Task 3).
- Produces: `src/styles.css` — the global stylesheet every component in this plan assumes is loaded (defines `.reveal`, `.reveal-delay-1..5`, `.glass-panel`, `.ambient-shadow`, `.btn-gradient`, `.gradient-text`, `.animate-float`, `.material-symbols-outlined`, and every `--color-*`/`--font-*` Tailwind v4 theme token referenced by every page's Tailwind classes in Tasks 10–15).

- [ ] **Step 1: Install Tailwind v4 and its PostCSS plugin**

```bash
cd /home/amit/projects/personal/portfolio-react
npm install -D tailwindcss @tailwindcss/postcss
```

- [ ] **Step 2: Create the PostCSS config**

Create `.postcssrc.json`:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

Angular's esbuild application builder auto-detects this file at the project root and applies it to every CSS file the build processes — no `angular.json` changes needed.

- [ ] **Step 3: Replace `src/styles.css` verbatim with the current design system**

Replace the entire contents of `src/styles.css` with:

```css
@import "tailwindcss";

@theme {
  --font-display: "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-label: "Geist", ui-sans-serif, system-ui, sans-serif;

  --color-background: #0b1326;
  --color-surface: #0b1326;
  --color-surface-variant: #2d3449;
  --color-surface-container-lowest: #060e20;
  --color-surface-container-low: #131b2e;
  --color-surface-container: #171f33;
  --color-surface-container-high: #222a3d;
  --color-surface-container-highest: #2d3449;

  --color-on-surface: #dae2fd;
  --color-on-surface-variant: #c1c6d7;
  --color-on-background: #dae2fd;

  --color-outline: #8b90a0;
  --color-outline-variant: #414755;

  --color-primary: #adc6ff;
  --color-on-primary: #002e69;
  --color-primary-container: #4b8eff;
  --color-primary-fixed: #d8e2ff;
  --color-primary-fixed-dim: #adc6ff;
  --color-inverse-primary: #005bc1;

  --color-secondary: #4edea3;
  --color-secondary-container: #00a572;

  --color-tertiary: #ffb595;
  --color-error: #ffb4ab;
}

html {
  color-scheme: dark;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--color-background);
  color: var(--color-on-background);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
}

button {
  font-family: inherit;
  cursor: pointer;
}

img {
  display: block;
  max-width: 100%;
}

::selection {
  background: color-mix(in srgb, var(--color-primary) 30%, transparent);
  color: var(--color-primary);
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Material Symbols icon font — ligature-based, no bundled SVG set needed */
.material-symbols-outlined {
  font-family: "Material Symbols Outlined";
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}

.ambient-shadow {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.glass-panel {
  background-color: rgba(30, 41, 59, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-gradient {
  background: linear-gradient(135deg, #4b8eff 0%, #005bc1 100%);
  transition: box-shadow 0.3s ease;
}
.btn-gradient:hover {
  box-shadow: 0 0 20px rgba(75, 142, 255, 0.5);
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-fixed) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Scroll reveal */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal.is-visible {
    opacity: 1;
    transform: none;
  }
  .reveal-delay-1 { transition-delay: 100ms; }
  .reveal-delay-2 { transition-delay: 200ms; }
  .reveal-delay-3 { transition-delay: 300ms; }
  .reveal-delay-4 { transition-delay: 400ms; }
  .reveal-delay-5 { transition-delay: 500ms; }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 4: Update `src/index.html` head content**

Open `src/index.html`. It will look roughly like:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>PortfolioReactNgScaffold</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

Replace the entire `<head>...</head>` block with:

```html
<head>
  <meta charset="utf-8">
  <title>ALEX.DEV — Building Digital Excellence</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Alex Dev — Software Architect, UX Strategist, Full-Stack Developer. Portfolio.">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Hanken+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
    rel="stylesheet"
  >
</head>
```

Leave `<body><app-root></app-root></body>` exactly as generated — do not add anything else to `<body>`.

- [ ] **Step 5: Verify the build picks up Tailwind and the fonts**

```bash
npm run build
```

Expected: build succeeds; inspect `dist/*/browser/styles-*.css` (exact path depends on the CLI's output layout) and confirm it contains compiled Tailwind utility CSS (e.g. search for `.flex{` or similar) and the `--color-background` custom property.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add Tailwind v4 (PostCSS) and port the global design-system stylesheet"
```

---

## Task 5: Copy images into `public/images/`

**Files:**
- Create: `public/images/hero-portrait.jpg`, `public/images/about-portrait.jpg`, `public/images/hero-quantum.jpg`, `public/images/hero-aura.jpg`, `public/images/proj-nexus-data.jpg`, `public/images/proj-aura-commerce.jpg`, `public/images/proj-synth-ai.jpg`, `public/images/proj-lumina.jpg`

**Interfaces:**
- Consumes: `_react-backup/src/assets/stitch/*.jpg` (Task 1).
- Produces: the 8 image files Task 6's `site.ts` references by path (`hero-nexus-design.jpg` from the backup is unused dead weight — it was never imported by `site.js` either — do not copy it).

- [ ] **Step 1: Copy the images**

```bash
cd /home/amit/projects/personal/portfolio-react
mkdir -p public/images
cp _react-backup/src/assets/stitch/hero-portrait.jpg public/images/
cp _react-backup/src/assets/stitch/about-portrait.jpg public/images/
cp _react-backup/src/assets/stitch/hero-quantum.jpg public/images/
cp _react-backup/src/assets/stitch/hero-aura.jpg public/images/
cp _react-backup/src/assets/stitch/proj-nexus-data.jpg public/images/
cp _react-backup/src/assets/stitch/proj-aura-commerce.jpg public/images/
cp _react-backup/src/assets/stitch/proj-synth-ai.jpg public/images/
cp _react-backup/src/assets/stitch/proj-lumina.jpg public/images/
ls public/images/
```

Expected: 8 files listed.

- [ ] **Step 2: Commit**

```bash
git add public/images
git commit -m "Add portfolio images to public/images"
```

---

## Task 6: Typed data file (`site.ts`)

**Files:**
- Create: `src/app/data/site.ts`

**Interfaces:**
- Consumes: image paths from Task 5.
- Produces: `Profile`, `NavItem`, `AboutContent`, `HomeAboutContent`, `ExperienceEntry`, `SkillsIntro`, `Competency`, `TechArsenalGroup`, `Project` interfaces, and `profile`, `nav`, `heroPortraitImg`, `aboutPortraitImg`, `about`, `homeAbout`, `experience`, `skillsIntro`, `competencies`, `techArsenal`, `certifications`, `projects`, `featuredProjectSlugs` consts — every later page/layout task imports from this file.

- [ ] **Step 1: Create `src/app/data/site.ts`**

```typescript
export interface Profile {
  brand: string;
  name: string;
  role: string;
  email: string;
  linkedin: string;
  github: string;
  twitter: string;
  dribbble: string;
}

export interface NavItem {
  label: string;
  to: string;
}

export interface AboutContent {
  heading: string;
  subheading: string;
  paragraphs: string[];
}

export interface HomeAboutStat {
  value: string;
  label: string;
}

export interface HomeAboutContent {
  heading: string;
  body: string;
  stats: HomeAboutStat[];
}

export interface ExperienceEntry {
  role: string;
  org: string;
  duration: string;
  highlights: string[];
}

export interface SkillsIntro {
  heading: string;
  body: string;
}

export interface Competency {
  label: string;
  percent: number;
}

export interface TechArsenalGroup {
  name: string;
  icon: string;
  items: string[];
}

export interface Project {
  slug: string;
  name: string;
  problem: string;
  stack: string[];
  image: string;
  heroImage?: string;
  heroTitle?: string;
  heroTagline?: string;
  heroTags?: string[];
}

export const profile: Profile = {
  brand: 'ALEX.DEV',
  name: 'Alex Dev',
  role: 'Software Architect | UX Strategist | Full-Stack Developer',
  email: 'hello@alex.dev',
  linkedin: '#',
  github: '#',
  twitter: '#',
  dribbble: '#',
};

export const nav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/skills' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
];

export const heroPortraitImg = '/images/hero-portrait.jpg';
export const aboutPortraitImg = '/images/about-portrait.jpg';

export const about: AboutContent = {
  heading: 'Engineering Reality',
  subheading: 'Translating complex problems into elegant, scalable solutions.',
  paragraphs: [
    "I am a software architect driven by the pursuit of technical excellence. My journey began with a fascination for how systems interconnect, evolving into a career dedicated to designing resilient architectures that withstand the test of scale.",
    "I believe in a \"measure twice, cut once\" philosophy. True engineering isn't just about writing code; it's about deeply understanding the domain, anticipating failure modes, and crafting robust abstractions that empower teams to move faster with confidence.",
  ],
};

export const homeAbout: HomeAboutContent = {
  heading: 'Engineering intent.',
  body: 'I bridge the gap between design and engineering. With over a decade of experience crafting scalable systems and intuitive interfaces, I focus on building digital products that are as robust under the hood as they are beautiful on the surface.',
  stats: [
    { value: '10+', label: 'Years of Experience' },
    { value: '50+', label: 'Projects Delivered' },
  ],
};

export const experience: ExperienceEntry[] = [
  {
    role: 'Lead Architect',
    org: 'Nexus Dynamics',
    duration: '2021 — Present',
    highlights: [
      'Architected a microservices transition, improving deployment frequency by 3x.',
      'Led a cross-functional team of 12 engineers across 3 time zones.',
      'Optimized core database querying logic, reducing latency by 40%.',
    ],
  },
  {
    role: 'Senior Engineer',
    org: 'Aero Systems',
    duration: '2018 — 2021',
    highlights: [
      'Developed highly available real-time telemetry ingestion pipelines.',
      'Implemented comprehensive CI/CD workflows reducing integration bugs by 60%.',
      'Mentored 5 junior developers, establishing an internal engineering guild.',
    ],
  },
  {
    role: 'Software Engineer',
    org: 'Quantum Logic',
    duration: '2015 — 2018',
    highlights: [
      'Built full-stack administrative dashboards using React and Node.js.',
      'Contributed to the initial design of the core user authentication service.',
    ],
  },
];

export const skillsIntro: SkillsIntro = {
  heading: 'Technical Expertise',
  body: 'A highly curated stack of modern technologies and architectural principles designed for performance, scalability, and seamless user experiences. Specializing in full-stack orchestration and robust cloud infrastructure.',
};

export const competencies: Competency[] = [
  { label: 'System Architecture', percent: 95 },
  { label: 'Frontend Engineering', percent: 90 },
  { label: 'Backend & API Design', percent: 88 },
  { label: 'Cloud Infrastructure (AWS)', percent: 85 },
];

export const techArsenal: TechArsenalGroup[] = [
  { name: 'Languages', icon: 'code', items: ['JavaScript (ES6+)', 'TypeScript', 'Go', 'Python', 'Rust'] },
  { name: 'Frontend', icon: 'web', items: ['React', 'Next.js', 'Tailwind CSS', 'WebGL / Three.js'] },
  { name: 'Backend', icon: 'dns', items: ['Node.js', 'GraphQL', 'PostgreSQL', 'Redis', 'Kafka'] },
  { name: 'Infrastructure', icon: 'cloud', items: ['AWS (EC2, S3, Lambda)', 'Docker & Kubernetes', 'Terraform', 'CI/CD Pipelines'] },
  { name: 'Tools', icon: 'handyman', items: ['Git', 'Figma', 'Jira', 'Postman'] },
];

export const certifications: string[] = [
  'AWS Certified Solutions Architect',
  'Certified Kubernetes Administrator (CKA)',
  'Google Cloud Professional Architect',
];

export const projects: Project[] = [
  {
    slug: 'nexus-data-platform',
    name: 'Nexus Data Platform',
    problem: 'Solving scalability issues for real-time data streaming and analytics processing for enterprise clients.',
    stack: ['React', 'Node.js', 'Kafka'],
    image: '/images/proj-nexus-data.jpg',
    heroImage: '/images/hero-quantum.jpg',
    heroTitle: 'Quantum Analytics Platform',
    heroTagline: 'High-performance data visualization engine capable of rendering million-point datasets with zero latency.',
    heroTags: ['React', 'WebGL'],
  },
  {
    slug: 'aura-commerce',
    name: 'Aura Commerce',
    problem: 'Re-architecting a monolithic e-commerce frontend into a performant, headless micro-frontend architecture.',
    stack: ['Next.js', 'GraphQL', 'Tailwind'],
    image: '/images/proj-aura-commerce.jpg',
    heroImage: '/images/hero-aura.jpg',
    heroTitle: 'Aura E-Commerce App',
    heroTagline: 'Award-winning mobile shopping experience.',
  },
  {
    slug: 'synth-ai-api',
    name: 'Synth AI API',
    problem: 'Designing a secure, low-latency API gateway for serving custom machine learning models to thousands of concurrent users.',
    stack: ['Python', 'FastAPI', 'Docker'],
    image: '/images/proj-synth-ai.jpg',
    heroImage: '/images/proj-synth-ai.jpg',
    heroTitle: 'Synth AI API',
    heroTagline: 'Secure, low-latency ML model gateway.',
  },
  {
    slug: 'lumina-design-system',
    name: 'Lumina Design System',
    problem: 'Bridging the gap between design and engineering by creating a unified, accessible component library across multiple product lines.',
    stack: ['Figma', 'Storybook', 'Vue.js'],
    image: '/images/proj-lumina.jpg',
  },
];

export const featuredProjectSlugs: string[] = ['nexus-data-platform', 'aura-commerce', 'synth-ai-api'];
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /home/amit/projects/personal/portfolio-react
npx tsc --noEmit -p tsconfig.app.json
```

Expected: no type errors (this file has no consumers yet, so this just checks the file itself is syntactically/type valid).

- [ ] **Step 3: Commit**

```bash
git add src/app/data/site.ts
git commit -m "Add typed site data (port of site.js)"
```

---

## Task 7: Shared primitives — `IconComponent` and `RevealDirective`

**Files:**
- Create: `src/app/shared/icon/icon.component.ts`
- Create: `src/app/shared/reveal.directive.ts`

**Interfaces:**
- Consumes: nothing (no dependency on `site.ts`).
- Produces:
  - `IconComponent` (selector `app-icon`) — inputs `name: string` (required), `size: number` (default `20`), `extraClass: string` (default `''`). Every page task uses `<app-icon [name]="..." [size]="..." extraClass="...">`.
  - `RevealDirective` (selector `[appReveal]`) — input `appRevealDelay: number | undefined` (alias, so usage is `[appRevealDelay]="n"`). Applies host class `reveal` always; adds `reveal-delay-N` and, once intersecting (browser) or immediately (server), `is-visible`. Every page task applies `appReveal` directly to the element that had `<Reveal>` wrapping it in React.

- [ ] **Step 1: Create `IconComponent`**

`src/app/shared/icon/icon.component.ts`:

```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  host: { style: 'display: contents;' },
  template: `
    <span
      class="material-symbols-outlined"
      [class]="extraClass()"
      [style.font-size.px]="size()"
    >{{ name() }}</span>
  `,
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input<number>(20);
  readonly extraClass = input<string>('');
}
```

`:host { display: contents; }` (set inline via the `host` metadata's `style`) means the `<app-icon>` custom element itself generates no box — only the inner `<span>` participates in layout, so Tailwind's `group-hover:` transforms/positioning on the icon behave exactly as they did on React's plain `<span>`.

- [ ] **Step 2: Create `RevealDirective`**

`src/app/shared/reveal.directive.ts`:

```typescript
import { Directive, ElementRef, Renderer2, PLATFORM_ID, inject, input, OnInit, OnDestroy, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class RevealDirective implements OnInit, OnDestroy {
  readonly delay = input<number | undefined>(undefined, { alias: 'appRevealDelay' });

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  constructor() {
    // afterNextRender never runs during prerender/SSR — this callback is
    // guaranteed browser-only, so no isPlatformBrowser check needed here.
    afterNextRender(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(this.el.nativeElement, 'is-visible');
            this.observer?.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnInit(): void {
    const d = this.delay();
    if (d) {
      this.renderer.addClass(this.el.nativeElement, `reveal-delay-${d}`);
    }

    if (!isPlatformBrowser(this.platformId)) {
      // Prerendered/SSR output must not ship permanently opacity:0 content
      // to crawlers or no-JS clients — mark visible immediately on the server.
      // The browser path (afterNextRender above) is what actually animates
      // the reveal-on-scroll for real visitors.
      this.renderer.addClass(this.el.nativeElement, 'is-visible');
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
```

- [ ] **Step 3: Verify it compiles**

```bash
cd /home/amit/projects/personal/portfolio-react
npx tsc --noEmit -p tsconfig.app.json
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/shared
git commit -m "Add IconComponent and RevealDirective shared primitives"
```

---

## Task 8: Layout — `NavComponent` and `FooterComponent`

**Files:**
- Create: `src/app/layout/nav/nav.component.ts`
- Create: `src/app/layout/footer/footer.component.ts`

**Interfaces:**
- Consumes: `nav`, `profile` from `src/app/data/site.ts` (Task 6); `IconComponent` from `src/app/shared/icon/icon.component.ts` (Task 7).
- Produces: `NavComponent` (selector `app-nav`), `FooterComponent` (selector `app-footer`) — both used, with no inputs, directly in `AppComponent`'s template (Task 9).

- [ ] **Step 1: Create `NavComponent`**

`src/app/layout/nav/nav.component.ts`:

```typescript
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { nav, profile } from '../../data/site';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    <header class="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div class="flex justify-between items-center h-20 px-6 md:px-8 max-w-[1200px] mx-auto">
        <a routerLink="/" class="font-display text-2xl font-bold tracking-tighter text-on-surface">{{ profile.brand }}</a>

        <nav class="hidden md:flex gap-6 font-label text-sm">
          @for (n of nav; track n.label) {
            <a
              [routerLink]="n.to"
              routerLinkActive="!text-primary !border-primary"
              [routerLinkActiveOptions]="{ exact: n.to === '/' }"
              class="text-on-surface-variant hover:text-primary transition-colors duration-300 pb-1 border-b-2 border-transparent"
            >{{ n.label }}</a>
          }
        </nav>

        <a
          routerLink="/contact"
          class="hidden md:inline-flex btn-gradient text-white font-label text-sm px-6 py-3 rounded-lg transition-all duration-300 active:scale-95"
        >Let's Connect</a>

        <button
          class="md:hidden text-on-surface"
          [attr.aria-expanded]="open()"
          aria-label="Toggle navigation"
          (click)="open.set(!open())"
        >
          <app-icon [name]="open() ? 'close' : 'menu'" />
        </button>
      </div>

      @if (open()) {
        <div class="md:hidden flex flex-col px-6 pb-4 gap-1 bg-surface border-t border-white/5">
          @for (n of nav; track n.label) {
            <a
              [routerLink]="n.to"
              (click)="open.set(false)"
              class="py-3 border-b border-white/5 font-label text-sm text-on-surface"
            >{{ n.label }}</a>
          }
          <a
            routerLink="/contact"
            (click)="open.set(false)"
            class="btn-gradient text-white font-label text-sm px-6 py-3 rounded-lg text-center mt-3"
          >Let's Connect</a>
        </div>
      }
    </header>
  `,
})
export class NavComponent {
  protected readonly nav = nav;
  protected readonly profile = profile;
  protected readonly open = signal(false);
}
```

**Why `routerLinkActive="!text-primary !border-primary"` uses Tailwind's `!important` modifier:** Angular's `routerLinkActive` *adds* classes on top of the element's static `class` attribute — it does not swap/replace it the way React's `className={active ? a : b}` does. The static class already sets `text-on-surface-variant` and `border-transparent`; without `!`, the active-state classes (`text-primary`, `border-primary`) would be present *alongside* those, and which one wins would depend on unpredictable Tailwind CSS generation order. The `!` prefix compiles to `!important`, guaranteeing the active-state colors always win regardless of source order. Do not simplify this to non-`!` classes.

- [ ] **Step 2: Create `FooterComponent`**

`src/app/layout/footer/footer.component.ts`:

```typescript
import { Component } from '@angular/core';
import { profile } from '../../data/site';

interface FooterLink {
  label: string;
  href: string;
}

const links: FooterLink[] = [
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'GitHub', href: profile.github },
  { label: 'Twitter', href: profile.twitter },
  { label: 'Dribbble', href: profile.dribbble },
];

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-surface-container-lowest w-full py-20 border-t border-white/5">
      <div class="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 max-w-[1200px] mx-auto gap-4">
        <div class="font-display text-2xl font-bold text-on-surface">{{ profile.brand }}</div>
        <div class="flex gap-6 font-label text-sm">
          @for (l of links; track l.label) {
            <a [href]="l.href" class="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">{{ l.label }}</a>
          }
        </div>
        <div class="font-body text-sm text-on-surface-variant">© 2024 Alex Dev. Engineered with precision.</div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly profile = profile;
  protected readonly links = links;
}
```

- [ ] **Step 3: Verify**

```bash
cd /home/amit/projects/personal/portfolio-react
npx tsc --noEmit -p tsconfig.app.json
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout
git commit -m "Add NavComponent and FooterComponent"
```

---

## Task 9: App shell, routing, and scroll restoration

**Files:**
- Modify: `src/app/app.component.ts` (full replacement of generated content)
- Modify: `src/app/app.routes.ts` (full replacement)
- Modify: `src/app/app.config.ts` (targeted edit — see below)

**Interfaces:**
- Consumes: `NavComponent`, `FooterComponent` (Task 8). References `HomeComponent`, `AboutComponent`, `SkillsComponent`, `ProjectsComponent`, `ProjectDetailComponent`, `ContactComponent`, which don't exist until Tasks 10–15 — **this task's build will fail until those exist.** Do the import/route wiring here, but the "verify build" step for *this* task only checks lint + that the route/component names match what Tasks 10–15 will produce; full `npm run build` success is confirmed at the end of Task 15.
- Produces: the app shell (`<app-nav>` + `<router-outlet>` + `<app-footer>`) and the 6 routes every page task's URL depends on. `withComponentInputBinding()` (added here) is what makes `ProjectDetailComponent`'s `slug` input (Task 14) automatically populate from the `:slug` route param.

- [ ] **Step 1: Replace `src/app/app.component.ts`**

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-background text-on-background">
      <app-nav />
      <main class="flex-grow pt-20">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class AppComponent {}
```

Delete `src/app/app.component.html` and `src/app/app.component.css` if the scaffold generated them (the template above is inline; remove `templateUrl`/`styleUrl` references from the decorator if they were auto-generated with them).

- [ ] **Step 2: Replace `src/app/app.routes.ts`**

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/:slug', component: ProjectDetailComponent },
  { path: 'contact', component: ContactComponent },
];
```

- [ ] **Step 3: Edit `src/app/app.config.ts`**

Open the generated file. It contains a `provideRouter(routes)` call inside the `providers` array (from the `--routing` flag used at scaffold time). Change that one line:

Find:
```typescript
provideRouter(routes),
```

Replace with:
```typescript
provideRouter(
  routes,
  withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'disabled' }),
  withComponentInputBinding()
),
```

And update the `@angular/router` import line at the top of the file to include the two new symbols:

Find:
```typescript
import { provideRouter } from '@angular/router';
```

Replace with:
```typescript
import { provideRouter, withInMemoryScrolling, withComponentInputBinding } from '@angular/router';
```

Leave every other provider in `app.config.ts` (change detection, client hydration, etc.) exactly as `ng new --ssr` generated it.

- [ ] **Step 4: Commit**

```bash
cd /home/amit/projects/personal/portfolio-react
git add src/app/app.component.ts src/app/app.routes.ts src/app/app.config.ts
git rm --cached src/app/app.component.html src/app/app.component.css 2>/dev/null || true
git commit -m "Wire up app shell, routes, scroll restoration, and component input binding"
```

(This task's build will not succeed standalone — proceed to Task 10.)

---

## Task 10: Home page

**Files:**
- Create: `src/app/pages/home/home.component.ts`
- Create: `src/app/pages/home/home.component.html`

**Interfaces:**
- Consumes: `profile`, `homeAbout`, `projects`, `featuredProjectSlugs`, `heroPortraitImg`, `Project` from `src/app/data/site.ts` (Task 6); `IconComponent` (Task 7); `RevealDirective` (Task 7); routed at `/` (Task 9).
- Produces: `HomeComponent` (selector `app-home`), referenced by `app.routes.ts` (Task 9).

- [ ] **Step 1: Create `home.component.ts`**

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { profile, homeAbout, projects, featuredProjectSlugs, heroPortraitImg, type Project } from '../../data/site';

const featured: Project[] = featuredProjectSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is Project => !!p);

@Component({
  selector: 'app-home',
  imports: [RouterLink, IconComponent, RevealDirective],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly profile = profile;
  protected readonly homeAbout = homeAbout;
  protected readonly heroPortraitImg = heroPortraitImg;
  protected readonly featured = featured;
}
```

- [ ] **Step 2: Create `home.component.html`**

```html
<div>
  <!-- Hero -->
  <section class="min-h-[80vh] flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-10 max-w-[1200px] mx-auto relative mb-20">
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/20 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-container/10 rounded-full blur-[100px]"></div>
    </div>

    <div appReveal class="flex-1 w-full max-w-md md:max-w-none">
      <div class="aspect-[3/4] md:aspect-square rounded-xl overflow-hidden border border-white/10 relative z-10 ambient-shadow animate-float">
        <img
          class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          [src]="heroPortraitImg"
          alt="Portrait"
        />
      </div>
    </div>

    <div appReveal [appRevealDelay]="1" class="flex-1 text-left w-full">
      <div class="inline-block mb-4 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 font-label text-sm text-primary">
        Available for new opportunities
      </div>
      <h1 class="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] tracking-[-0.02em] font-bold mb-6 text-on-surface">
        Building Digital <br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-inverse-primary">Excellence</span>
      </h1>
      <p class="font-body text-lg leading-7 text-on-surface-variant max-w-2xl mb-10">{{ profile.role }}</p>
      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <a
          href="#projects"
          class="btn-gradient text-white font-label text-sm px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95"
        >
          View Projects
          <app-icon name="arrow_forward" [size]="20" extraClass="group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          routerLink="/contact"
          class="bg-transparent border border-outline-variant text-on-surface font-label text-sm px-8 py-4 rounded-lg hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center active:scale-95"
        >
          Get in Touch
        </a>
      </div>
    </div>
  </section>

  <!-- Featured Work -->
  <section class="py-10 px-6 md:px-10 max-w-[1200px] mx-auto" id="projects">
    <div appReveal class="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-4">
      <div>
        <h2 class="font-display text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-on-surface mb-2">Featured Work</h2>
        <p class="font-body text-base text-on-surface-variant">Selected projects demonstrating technical depth and design precision.</p>
      </div>
      <a routerLink="/projects" class="text-primary hover:text-inverse-primary font-label text-sm flex items-center gap-1 transition-colors">
        View all projects <app-icon name="north_east" [size]="18" />
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (p of featured; track p.slug; let i = $index) {
        @if (i === 0) {
          <a
            [routerLink]="['/projects', p.slug]"
            appReveal
            class="lg:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-xl border border-white/10 ambient-shadow min-h-[400px] block"
          >
            <div
              class="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              [style.background-image]="'url(' + p.heroImage! + ')'"
            ></div>
            <div class="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-8 w-full">
              <div class="flex gap-2 mb-4 flex-wrap">
                @for (t of (p.heroTags ?? p.stack).slice(0, 2); track t) {
                  <span class="px-3 py-1 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary font-label text-xs rounded-full">{{ t }}</span>
                }
              </div>
              <h3 class="font-display text-[40px] leading-[48px] font-bold text-on-surface mb-2">{{ p.heroTitle }}</h3>
              <p class="font-body text-lg text-on-surface-variant max-w-xl">{{ p.heroTagline }}</p>
            </div>
          </a>
        } @else {
          <a
            [routerLink]="['/projects', p.slug]"
            appReveal
            [appRevealDelay]="i"
            class="relative group overflow-hidden rounded-xl border border-white/10 ambient-shadow min-h-[300px] lg:min-h-0 block"
          >
            <div
              class="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              [style.background-image]="'url(' + p.heroImage! + ')'"
            ></div>
            <div class="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-6 w-full">
              <h3 class="font-display text-2xl font-semibold text-on-surface mb-1">{{ p.heroTitle }}</h3>
              <p class="font-body text-base text-on-surface-variant">{{ p.heroTagline }}</p>
            </div>
          </a>
        }
      }
    </div>
  </section>

  <!-- Engineering intent -->
  <section class="py-20 px-6 md:px-10 max-w-[1200px] mx-auto relative" id="about">
    <div appReveal class="grid grid-cols-1 md:grid-cols-3 gap-10 items-start bg-surface-container-low p-10 rounded-2xl border border-white/5">
      <div class="md:col-span-1 flex flex-col gap-4">
        <h2 class="font-display text-2xl font-semibold tracking-tight text-on-surface">{{ homeAbout.heading }}</h2>
        <p class="font-body text-lg leading-relaxed text-on-surface-variant opacity-80">{{ homeAbout.body }}</p>
      </div>
      <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:pl-10">
        @for (s of homeAbout.stats; track s.label; let last = $last) {
          <div class="flex flex-col justify-center p-6 bg-surface-container-high/30 rounded-xl border border-white/5 hover:border-primary/30 transition-colors duration-300">
            <span class="block font-display text-[64px] leading-none text-primary mb-1">{{ s.value }}</span>
            <span class="font-label text-sm text-on-surface-variant uppercase tracking-widest opacity-60">{{ s.label }}</span>
            @if (last) {
              <a routerLink="/about" class="inline-flex items-center gap-2 text-primary hover:text-inverse-primary font-label text-sm group transition-colors mt-4">
                Read full bio
                <app-icon name="arrow_right_alt" [size]="20" extraClass="group-hover:translate-x-1 transition-transform" />
              </a>
            }
          </div>
        }
      </div>
    </div>
  </section>

  <!-- Contact teaser -->
  <section class="mb-20 mt-10">
    <div appReveal class="bg-surface-container-low py-20 px-6 border-y border-white/5 text-center relative overflow-hidden w-full">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
      <h2 class="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] font-bold text-on-surface mb-4 relative z-10">
        Let's build something <br class="hidden md:block" /> extraordinary.
      </h2>
      <p class="font-body text-lg text-on-surface-variant max-w-xl mx-auto mb-10 relative z-10">
        Currently accepting new projects and consulting opportunities. Reach out to discuss how we can collaborate.
      </p>
      <a
        [href]="'mailto:' + profile.email"
        class="inline-block btn-gradient text-white font-label px-10 py-5 rounded-lg transition-all duration-300 relative z-10 text-lg shadow-[0_0_20px_rgba(75,142,255,0.3)] active:scale-95"
      >{{ profile.email }}</a>
    </div>
  </section>
</div>
```

- [ ] **Step 3: Verify**

```bash
cd /home/amit/projects/personal/portfolio-react
npm run lint
```

Expected: no errors (full `npm run build` still fails until Tasks 11–15 exist — that's expected).

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/home
git commit -m "Add Home page"
```

---

## Task 11: About page

**Files:**
- Create: `src/app/pages/about/about.component.ts`
- Create: `src/app/pages/about/about.component.html`

**Interfaces:**
- Consumes: `about`, `aboutPortraitImg`, `experience` from `site.ts` (Task 6); `RevealDirective` (Task 7); routed at `/about` (Task 9).
- Produces: `AboutComponent` (selector `app-about`), referenced by `app.routes.ts` (Task 9).

- [ ] **Step 1: Create `about.component.ts`**

```typescript
import { Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { about, aboutPortraitImg, experience } from '../../data/site';

@Component({
  selector: 'app-about',
  imports: [RevealDirective],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  protected readonly about = about;
  protected readonly aboutPortraitImg = aboutPortraitImg;
  protected readonly experience = experience;

  protected delayFor(index: number): number {
    return Math.min(index + 1, 5);
  }
}
```

- [ ] **Step 2: Create `about.component.html`**

```html
<div class="max-w-[1200px] mx-auto px-6 md:px-10 py-20 flex flex-col gap-20">
  <!-- About -->
  <section appReveal class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
    <div class="col-span-1 md:col-span-5 relative">
      <div class="aspect-[4/5] rounded-xl overflow-hidden glass-panel ambient-shadow relative p-2 bg-surface-container-low">
        <img
          class="w-full h-full object-cover rounded-lg grayscale hover:grayscale-0 transition-all duration-700"
          [src]="aboutPortraitImg"
          alt="Portrait"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 pointer-events-none"></div>
      </div>
    </div>
    <div class="col-span-1 md:col-span-7 flex flex-col gap-6">
      <div>
        <h1 class="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] font-bold text-on-surface mb-2">
          {{ about.heading }}
        </h1>
        <p class="font-display text-2xl font-semibold text-on-surface-variant">{{ about.subheading }}</p>
      </div>
      <div class="font-body text-lg text-on-surface-variant space-y-4">
        @for (p of about.paragraphs; track p) {
          <p>{{ p }}</p>
        }
      </div>
    </div>
  </section>

  <!-- Experience -->
  <section class="flex flex-col gap-6" id="experience">
    <h2 appReveal class="font-display text-2xl font-semibold text-on-surface border-b border-white/10 pb-4">
      Professional Timeline
    </h2>
    <div class="flex flex-col gap-10 relative pl-8 md:pl-12 mt-2">
      @for (item of experience; track item.org; let i = $index) {
        <div appReveal [appRevealDelay]="delayFor(i)" class="relative">
          <div class="absolute left-[-30px] md:left-[-46px] top-1 bottom-[-40px] w-px bg-white/10" aria-hidden="true"></div>
          <div class="absolute -left-[30px] md:-left-[46px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background z-10"></div>
          <div class="glass-panel p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start md:items-center hover:-translate-y-1 transition-transform duration-300 bg-surface-container-low">
            <div class="w-full md:w-1/3 flex flex-col">
              <span class="font-label text-sm text-primary tracking-widest uppercase">{{ item.duration }}</span>
              <h3 class="font-display text-2xl font-semibold text-on-surface mt-1">{{ item.role }}</h3>
              <span class="font-body text-base text-on-surface-variant">{{ item.org }}</span>
            </div>
            <div class="w-full md:w-2/3">
              <ul class="font-body text-base text-on-surface-variant list-disc list-inside space-y-2">
                @for (h of item.highlights; track h) {
                  <li>{{ h }}</li>
                }
              </ul>
            </div>
          </div>
        </div>
      }
    </div>
  </section>
</div>
```

- [ ] **Step 3: Verify**

```bash
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/about
git commit -m "Add About page"
```

---

## Task 12: Skills page and `CompetencyBarComponent`

**Files:**
- Create: `src/app/pages/skills/skills.component.ts`
- Create: `src/app/pages/skills/skills.component.html`
- Create: `src/app/pages/skills/competency-bar/competency-bar.component.ts`

**Interfaces:**
- Consumes: `skillsIntro`, `competencies`, `techArsenal`, `certifications` from `site.ts` (Task 6); `IconComponent`, `RevealDirective` (Task 7); routed at `/skills` (Task 9).
- Produces: `SkillsComponent` (selector `app-skills`, referenced by `app.routes.ts`), `CompetencyBarComponent` (selector `app-competency-bar`, inputs `label: string` required, `percent: number` required — page-local, not exported from `shared/`, matching its scope in the current React app).

- [ ] **Step 1: Create `CompetencyBarComponent`**

`src/app/pages/skills/competency-bar/competency-bar.component.ts`:

```typescript
import { Component, input, signal, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-competency-bar',
  template: `
    <div>
      <div class="flex justify-between mb-1">
        <span class="font-label text-sm text-on-surface">{{ label() }}</span>
        <span class="font-label text-sm text-secondary">{{ percent() }}%</span>
      </div>
      <div class="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-[width] duration-1000 ease-out"
          [style.width.%]="width()"
          style="background: linear-gradient(90deg, var(--color-primary-container), var(--color-primary)); box-shadow: 0 0 10px rgba(173, 198, 255, 0.5);"
        ></div>
      </div>
    </div>
  `,
})
export class CompetencyBarComponent {
  readonly label = input.required<string>();
  readonly percent = input.required<number>();

  protected readonly width = signal(0);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.width.set(this.percent()), 300);
    });
  }
}
```

- [ ] **Step 2: Create `SkillsComponent`**

`src/app/pages/skills/skills.component.ts`:

```typescript
import { Component } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { CompetencyBarComponent } from './competency-bar/competency-bar.component';
import { skillsIntro, competencies, techArsenal, certifications } from '../../data/site';

@Component({
  selector: 'app-skills',
  imports: [IconComponent, RevealDirective, CompetencyBarComponent],
  templateUrl: './skills.component.html',
})
export class SkillsComponent {
  protected readonly skillsIntro = skillsIntro;
  protected readonly competencies = competencies;
  protected readonly techArsenal = techArsenal;
  protected readonly certifications = certifications;

  protected delayFor(index: number): number {
    return Math.min(index + 1, 5);
  }
}
```

- [ ] **Step 3: Create `skills.component.html`**

```html
<div class="max-w-[1200px] mx-auto px-6 md:px-10 py-20 flex flex-col gap-20">
  <section appReveal class="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto">
    <h1 class="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] font-bold text-on-surface">
      {{ skillsIntro.heading }}
    </h1>
    <p class="font-body text-lg text-on-surface-variant">{{ skillsIntro.body }}</p>
  </section>

  <section appReveal class="glass-panel rounded-xl p-6 md:p-10">
    <h2 class="font-display text-2xl font-semibold text-on-surface mb-6 flex items-center gap-2">
      <app-icon name="analytics" extraClass="text-primary" />
      Core Competencies
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
      @for (c of competencies; track c.label) {
        <app-competency-bar [label]="c.label" [percent]="c.percent" />
      }
    </div>
  </section>

  <section>
    <h2 appReveal class="font-display text-2xl font-semibold text-on-surface mb-6 text-center">
      Technical Arsenal
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (group of techArsenal; track group.name; let i = $index) {
        <div appReveal [appRevealDelay]="delayFor(i)" class="glass-panel rounded-xl p-6 group">
          <div class="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center mb-4 border border-white/5 group-hover:bg-surface-bright transition-colors">
            <app-icon [name]="group.icon" [size]="28" extraClass="text-primary" />
          </div>
          <h3 class="font-display text-2xl font-semibold text-on-surface mb-4 group-hover:text-primary transition-colors">
            {{ group.name }}
          </h3>
          <ul class="space-y-2 font-body text-base text-on-surface-variant">
            @for (item of group.items; track item) {
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                {{ item }}
              </li>
            }
          </ul>
        </div>
      }

      <div appReveal [appRevealDelay]="5" class="glass-panel rounded-xl p-6 md:col-span-2 lg:col-span-1 group">
        <div class="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center mb-4 border border-white/5 group-hover:bg-surface-bright transition-colors">
          <app-icon name="workspace_premium" [size]="28" extraClass="text-secondary" />
        </div>
        <h3 class="font-display text-2xl font-semibold text-on-surface mb-4 group-hover:text-secondary transition-colors">
          Certifications
        </h3>
        <ul class="space-y-2 font-body text-base text-on-surface-variant">
          @for (cert of certifications; track cert) {
            <li class="flex items-start gap-2">
              <app-icon name="verified" [size]="16" extraClass="text-secondary mt-1" />
              <span>{{ cert }}</span>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>
</div>
```

- [ ] **Step 4: Verify**

```bash
cd /home/amit/projects/personal/portfolio-react
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/app/pages/skills
git commit -m "Add Skills page and CompetencyBarComponent"
```

---

## Task 13: Projects page

**Files:**
- Create: `src/app/pages/projects/projects.component.ts`
- Create: `src/app/pages/projects/projects.component.html`

**Interfaces:**
- Consumes: `projects` from `site.ts` (Task 6); `IconComponent`, `RevealDirective` (Task 7); routed at `/projects` (Task 9).
- Produces: `ProjectsComponent` (selector `app-projects`), referenced by `app.routes.ts` (Task 9).

- [ ] **Step 1: Create `projects.component.ts`**

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { projects } from '../../data/site';

@Component({
  selector: 'app-projects',
  imports: [RouterLink, IconComponent, RevealDirective],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  protected readonly projects = projects;

  protected delayFor(index: number): number {
    return Math.min(index + 1, 5);
  }
}
```

- [ ] **Step 2: Create `projects.component.html`**

```html
<div class="max-w-[1200px] mx-auto px-6 md:px-10 py-20 flex flex-col items-center gap-20">
  <section appReveal class="w-full text-center flex flex-col items-center gap-4">
    <h1 class="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] font-bold text-on-surface">My Work</h1>
    <p class="font-body text-lg text-on-surface-variant max-w-2xl">
      A curated showcase of engineering challenges turned into scalable solutions. Exploring the intersection of high-performance
      backend systems and fluid frontend experiences.
    </p>
  </section>

  <section class="w-full grid grid-cols-1 md:grid-cols-2 gap-10">
    @for (p of projects; track p.slug; let i = $index) {
      <article
        appReveal
        [appRevealDelay]="delayFor(i)"
        class="glass-panel rounded-xl overflow-hidden ambient-shadow flex flex-col hover:scale-[1.02] transition-transform duration-300 bg-surface-container-high"
      >
        <div class="h-64 w-full bg-surface-container-high relative overflow-hidden group">
          <img
            class="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            [src]="p.image"
            [alt]="p.name"
          />
        </div>
        <div class="p-6 flex flex-col flex-grow gap-4">
          <div class="flex justify-between items-start">
            <h2 class="font-display text-2xl font-semibold text-on-surface">{{ p.name }}</h2>
            <app-icon name="open_in_new" extraClass="text-on-surface-variant" />
          </div>
          <p class="font-body text-base text-on-surface-variant flex-grow">
            <strong class="text-on-surface">Problem:</strong> {{ p.problem }}
          </p>
          <div class="flex flex-wrap gap-2 pt-2">
            @for (s of p.stack; track s) {
              <span class="font-label text-sm px-2 py-1 rounded bg-surface-container-lowest text-primary-fixed-dim">{{ s }}</span>
            }
          </div>
          <a [routerLink]="['/projects', p.slug]" class="mt-2 font-label text-sm text-primary hover:text-primary-fixed transition-colors flex items-center gap-1">
            View Case Study <app-icon name="arrow_forward" [size]="16" />
          </a>
        </div>
      </article>
    }
  </section>
</div>
```

- [ ] **Step 3: Verify**

```bash
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/projects
git commit -m "Add Projects page"
```

---

## Task 14: ProjectDetail page

**Files:**
- Create: `src/app/pages/project-detail/project-detail.component.ts`
- Create: `src/app/pages/project-detail/project-detail.component.html`

**Interfaces:**
- Consumes: `projects`, `Project` from `site.ts` (Task 6); `RevealDirective` (Task 7); `withComponentInputBinding()` from `app.config.ts` (Task 9) for the `slug` route-param binding; routed at `/projects/:slug` (Task 9).
- Produces: `ProjectDetailComponent` (selector `app-project-detail`), referenced by `app.routes.ts` (Task 9) and by Task 16's `getPrerenderParams()`, which must enumerate the same `projects` slugs this component looks up.

- [ ] **Step 1: Create `project-detail.component.ts`**

```typescript
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/reveal.directive';
import { projects, type Project } from '../../data/site';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, RevealDirective],
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent {
  readonly slug = input<string>('');

  protected readonly project = computed<Project | undefined>(() =>
    projects.find((p) => p.slug === this.slug())
  );
}
```

`slug` is populated automatically from the `:slug` route segment because `withComponentInputBinding()` is enabled in `app.config.ts` (Task 9) — no `ActivatedRoute` injection needed.

- [ ] **Step 2: Create `project-detail.component.html`**

```html
@if (!project()) {
  <div class="max-w-[1200px] mx-auto px-6 md:px-10 py-20">
    <h1 class="font-display text-3xl font-semibold text-on-surface mb-6">No project named "{{ slug() }}"</h1>
    <a routerLink="/projects" class="font-label text-sm text-primary hover:text-primary-fixed transition-colors">
      ← back to projects
    </a>
  </div>
} @else {
  <div class="max-w-[1200px] mx-auto px-6 md:px-10 py-20 flex flex-col gap-10">
    <a routerLink="/projects" class="font-label text-sm text-primary hover:text-primary-fixed transition-colors w-fit">
      ← back to projects
    </a>

    <header appReveal class="rounded-xl overflow-hidden border border-white/10 ambient-shadow relative min-h-[280px]">
      <div class="absolute inset-0 bg-cover bg-center" [style.background-image]="'url(' + project()!.image + ')'"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent"></div>
      <div class="relative z-10 p-8">
        <h1 class="font-display text-[40px] leading-[48px] font-bold text-on-surface mb-3">{{ project()!.name }}</h1>
        <div class="flex flex-wrap gap-2">
          @for (s of project()!.stack; track s) {
            <span class="px-3 py-1 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary font-label text-sm rounded-full">{{ s }}</span>
          }
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div appReveal class="glass-panel bg-surface-container-low rounded-xl p-6">
        <p class="font-label text-sm text-primary uppercase tracking-widest mb-2">Problem</p>
        <p class="font-body text-base text-on-surface-variant">{{ project()!.problem }}</p>
      </div>
      <div appReveal [appRevealDelay]="1" class="glass-panel bg-surface-container-low rounded-xl p-6">
        <p class="font-label text-sm text-primary uppercase tracking-widest mb-2">Solution</p>
        <p class="font-body text-base text-on-surface-variant opacity-70">[Add the approach and key design decision.]</p>
      </div>
      <div appReveal [appRevealDelay]="2" class="glass-panel bg-surface-container-low rounded-xl p-6">
        <p class="font-label text-sm text-primary uppercase tracking-widest mb-2">Challenges</p>
        <p class="font-body text-base text-on-surface-variant opacity-70">[Add a technical constraint solved around.]</p>
      </div>
      <div appReveal [appRevealDelay]="3" class="glass-panel bg-surface-container-low rounded-xl p-6">
        <p class="font-label text-sm text-primary uppercase tracking-widest mb-2">Results</p>
        <p class="font-body text-base text-on-surface-variant opacity-70">[Add a concrete, verified outcome.]</p>
      </div>
    </div>
  </div>
}
```

- [ ] **Step 3: Verify**

```bash
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/project-detail
git commit -m "Add ProjectDetail page"
```

---

## Task 15: Contact page

**Files:**
- Create: `src/app/pages/contact/contact.component.ts`
- Create: `src/app/pages/contact/contact.component.html`

**Interfaces:**
- Consumes: `profile` from `site.ts` (Task 6); `IconComponent`, `RevealDirective` (Task 7); routed at `/contact` (Task 9).
- Produces: `ContactComponent` (selector `app-contact`), referenced by `app.routes.ts` (Task 9). This is the last page task — `npm run build` must succeed after this task.

- [ ] **Step 1: Create `contact.component.ts`**

```typescript
import { Component, signal } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent } from '../../shared/icon/icon.component';
import { profile } from '../../data/site';

interface InfoCard {
  icon: string;
  title: string;
  body: string;
  linkLabel: string;
  href: string;
}

const infoCards: InfoCard[] = [
  {
    icon: 'mail',
    title: 'Email',
    body: 'Prefer direct email? Drop me a line anytime.',
    linkLabel: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: 'calendar_today',
    title: 'Book a Call',
    body: "Let's discuss your project face-to-face via a quick discovery call.",
    linkLabel: 'Schedule on Calendly',
    href: '#',
  },
  {
    icon: 'link',
    title: 'Network',
    body: 'Connect with me professionally.',
    linkLabel: 'LinkedIn Profile',
    href: profile.linkedin,
  },
];

@Component({
  selector: 'app-contact',
  imports: [RevealDirective, IconComponent],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  protected readonly infoCards = infoCards;

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly subject = signal('');
  protected readonly message = signal('');

  protected delayFor(index: number): number {
    return index + 1;
  }

  protected handleSubmit(event: Event): void {
    event.preventDefault();
    const body = encodeURIComponent(`${this.message()}\n\n— ${this.name()} (${this.email()})`);
    const subject = encodeURIComponent(this.subject() || 'Project inquiry');
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  }
}
```

- [ ] **Step 2: Create `contact.component.html`**

```html
<div class="max-w-[1200px] mx-auto px-6 md:px-10 py-20 grid grid-cols-1 lg:grid-cols-12 gap-6">
  <header appReveal class="lg:col-span-12 mb-10">
    <h1 class="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] font-bold text-on-surface mb-2">
      Start a Conversation.
    </h1>
    <p class="font-body text-lg text-on-surface-variant max-w-2xl">
      Whether you have a question, a project proposal, or just want to say hi, my inbox is always open.
    </p>
  </header>

  <section appReveal class="lg:col-span-7 bg-surface-container-low border border-white/10 rounded-xl p-8 ambient-shadow relative overflow-hidden">
    <div class="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full mix-blend-screen blur-[80px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
    <form (submit)="handleSubmit($event)" class="flex flex-col gap-4 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-label text-sm text-on-surface-variant" for="name">Name</label>
          <input
            id="name"
            required
            type="text"
            placeholder="Jane Doe"
            [value]="name()"
            (input)="name.set($any($event.target).value)"
            class="bg-surface-container text-on-surface border border-outline-variant rounded-lg p-3 font-body text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label text-sm text-on-surface-variant" for="email">Email</label>
          <input
            id="email"
            required
            type="email"
            placeholder="jane@example.com"
            [value]="email()"
            (input)="email.set($any($event.target).value)"
            class="bg-surface-container text-on-surface border border-outline-variant rounded-lg p-3 font-body text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
          />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-label text-sm text-on-surface-variant" for="subject">Subject</label>
        <input
          id="subject"
          type="text"
          placeholder="Project Inquiry"
          [value]="subject()"
          (input)="subject.set($any($event.target).value)"
          class="bg-surface-container text-on-surface border border-outline-variant rounded-lg p-3 font-body text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-label text-sm text-on-surface-variant" for="message">Message</label>
        <textarea
          id="message"
          required
          rows="5"
          placeholder="Tell me about your project..."
          [value]="message()"
          (input)="message.set($any($event.target).value)"
          class="bg-surface-container text-on-surface border border-outline-variant rounded-lg p-3 font-body text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors resize-none"
        ></textarea>
      </div>
      <button
        type="submit"
        class="mt-4 self-start btn-gradient text-white font-label text-sm py-3 px-6 rounded-lg inline-flex items-center gap-2"
      >
        Send Message
        <app-icon name="send" [size]="18" />
      </button>
      <p class="font-body text-sm text-on-surface-variant opacity-70">Opens your email client with this filled in.</p>
    </form>
  </section>

  <aside class="lg:col-span-5 flex flex-col gap-6">
    @for (c of infoCards; track c.title; let i = $index) {
      <div appReveal [appRevealDelay]="delayFor(i)" class="bg-surface-container-low border border-white/10 rounded-xl p-6 flex flex-col gap-2 ambient-shadow">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center border border-primary/20">
            <app-icon [name]="c.icon" extraClass="text-primary" />
          </div>
          <h3 class="font-display text-2xl font-semibold text-on-surface">{{ c.title }}</h3>
        </div>
        <p class="font-body text-base text-on-surface-variant">{{ c.body }}</p>
        <a [href]="c.href" class="font-label text-sm text-primary hover:text-primary-fixed transition-colors inline-flex items-center gap-1 mt-2">
          {{ c.linkLabel }}
          <app-icon name="arrow_forward" [size]="16" />
        </a>
      </div>
    }
  </aside>
</div>
```

- [ ] **Step 3: Verify the full app now builds**

```bash
cd /home/amit/projects/personal/portfolio-react
npm run lint
npm run build
```

Expected: both succeed with no errors — this is the first point where the whole route tree compiles end-to-end (Task 9 wired routes to components that didn't exist until now).

- [ ] **Step 4: Manual smoke test**

```bash
npm start
```

Visit `http://localhost:4200/`, `/about`, `/skills`, `/projects`, `/projects/nexus-data-platform`, `/contact`. Confirm: nav highlights the current page, mobile menu (narrow the window) opens/closes, scroll position resets to top on every navigation, the hero portrait floats, sections fade/slide in on scroll, the Skills competency bars animate in from 0%, the contact form's Send button opens a `mailto:` link. Stop the server (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add src/app/pages/contact
git commit -m "Add Contact page — full route tree now builds"
```

---

## Task 16: SSG prerendering (including dynamic `projects/:slug`)

**Files:**
- Create: `src/app/app.routes.server.ts`
- Modify: `src/app/app.config.server.ts` (targeted edit)

**Interfaces:**
- Consumes: `projects` from `site.ts` (Task 6, for slug enumeration); `app.config.ts` (Task 9, via `mergeApplicationConfig`).
- Produces: every route — including one prerendered page per `projects[].slug` — as static HTML in the build output. No other task depends on this one; it's the last functional piece before final verification (Task 17).

- [ ] **Step 1: Create `src/app/app.routes.server.ts`**

```typescript
import { RenderMode, ServerRoute } from '@angular/ssr';
import { projects } from './data/site';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return projects.map((p) => ({ slug: p.slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
```

- [ ] **Step 2: Edit `src/app/app.config.server.ts`**

Open the generated file — `ng new --ssr` produces something like:

```typescript
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

Change it to import and wire in `serverRoutes`:

```typescript
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(), provideServerRoutesConfig(serverRoutes)],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

If the generated file's exact shape differs (symbol names, whether `provideServerRoutesConfig` is already imported under a different name for the installed CLI version), keep its existing `provideServerRendering()` call and add `provideServerRoutesConfig(serverRoutes)` alongside it in the same `providers` array, adding whatever import that requires from `@angular/ssr`.

- [ ] **Step 3: Build and verify prerendered output**

```bash
cd /home/amit/projects/personal/portfolio-react
npm run build
find dist -iname "*.html" | sort
```

Expected: an `index.html` for `/`, `/about`, `/skills`, `/projects`, `/contact`, and one per project slug — `projects/nexus-data-platform/index.html`, `projects/aura-commerce/index.html`, `projects/synth-ai-api/index.html`, `projects/lumina-design-system/index.html` (exact output path layout depends on the installed CLI version, but every one of these 9 routes must produce a file).

- [ ] **Step 4: Verify prerendered content isn't hiding anything**

```bash
grep -l "opacity:0" dist/**/index.html 2>/dev/null || echo "no permanently-hidden reveal content found"
```

Expected: `"no permanently-hidden reveal content found"` — confirms the `RevealDirective`'s server-side `is-visible` fallback (Task 7) worked.

- [ ] **Step 5: Commit**

```bash
git add src/app/app.routes.server.ts src/app/app.config.server.ts
git commit -m "Configure SSG prerendering for all routes, including per-project slugs"
```

---

## Task 17: Full verification pass and report

**Files:** none created — this task only verifies and reports.

**Interfaces:**
- Consumes: everything from Tasks 1–16.
- Produces: nothing new in the repo (beyond an optional final commit if Step 4 finds and fixes something small). This is the plan's final deliverable: confirmation the migration is complete, correct, and safe to hand back to Amit.

- [ ] **Step 1: Full clean build**

```bash
cd /home/amit/projects/personal/portfolio-react
rm -rf dist .angular
npm run lint
npm run build
```

Expected: lint and build both succeed with zero errors/warnings.

- [ ] **Step 2: Serve the static prerendered output and screenshot every route**

```bash
npx -y http-server dist/*/browser -p 4300 &
sleep 2
```

Using a headless browser (Playwright, already used elsewhere in this project's history — install ad hoc if not present: `npm install --no-save playwright && npx playwright install chromium`), capture full-page screenshots at 1440px and 390px widths for `/`, `/about`, `/skills`, `/projects`, `/projects/nexus-data-platform`, `/contact`, scrolling through each page first so every `appReveal` element has fired.

Kill the static server when done:
```bash
kill %1
```

- [ ] **Step 3: Compare against the React baseline**

Compare the new screenshots against `.impeccable/review/desktop.png` / `.impeccable/review/mobile.png` (the React app's home-page reference) and, for every other route, against a live run of `_react-backup/` (`cd _react-backup && npm install && npm run dev`, screenshot, stop the server). Confirm for each route: identical layout, identical colors/typography, identical copy, hero float animation present, scroll-reveal animations present and firing at the same thresholds, mobile nav menu opens/closes identically, active-nav-link underline correct per route, Skills competency bars animate in, Contact form's submit opens the same `mailto:` link shape.

- [ ] **Step 4: Fix any drift found**

If Step 3 finds a real visual/behavioral difference, fix it in the relevant page/component file (from Tasks 10–15) and re-run Steps 1–3 for that route. Commit the fix with a message describing what drifted and why (e.g. `git commit -m "Fix Projects card hover scale — was missing group class"`).

- [ ] **Step 5: Report to Amit**

Summarize: what was ported, confirmation every route matches, and an explicit note that `_react-backup/` and the `pre-angular-migration` git tag are still in place and will only be removed when he explicitly asks for cleanup.

---

## Self-Review

**Spec coverage:**
- Backup + tag (spec §Decisions 2) → Task 1. ✅
- SSG rendering + browser-API guards (§Decisions 3, §SSG section) → Tasks 7 (directive guard), 16 (prerender config), 17 Step 4 (verify no hidden content). ✅
- No tests (§Decisions 4) → Task 2 Step 4 removes scaffolded tests; no `.spec.ts` created anywhere in Tasks 6–16. ✅
- ESLint + angular-eslint (§Decisions 5) → Task 3. ✅
- Standalone components, no NgModules (§Decisions 6) → every component task uses the standalone `imports` array in `@Component`, no `@NgModule` anywhere. ✅
- Folder structure (§Decisions 7, §Target folder structure) → Tasks 6–15 create exactly the `data/`, `shared/`, `layout/`, `pages/<name>/` layout specified. ✅
- Animation strategy — no `@angular/animations`, CSS ported verbatim, `Reveal` → directive not wrapper (§Decisions 8) → Task 4 Step 3 (verbatim CSS), Task 7 (directive). ✅
- Routing conveniences — `routerLinkActive`, `withInMemoryScrolling` (§Decisions 9) → Task 8 (Nav), Task 9 Step 3. ✅
- Shared components — `Icon`, `appReveal`; project cards stay split (§Decisions 10) → Task 7; Home (Task 10) and Projects (Task 13) keep their distinct card markup. ✅
- Data model with TS interfaces (§Data model) → Task 6, matches the spec's interface list. ✅
- Routing table (§Routing) → Task 9 Step 2, matches exactly. ✅
- SSG / `getPrerenderParams` (§SSG) → Task 16. ✅
- Component → component mapping table (§Component mapping) → every row has a corresponding task (Tasks 6–15); `ScrollToTop.jsx` row ("deleted — replaced by router's withInMemoryScrolling") is honored by simply never creating that file. ✅
- Tooling (§Tooling) → Tasks 2–4. ✅
- Assets (§Assets) → Task 5 (images), Task 4 Step 4 (fonts). ✅
- Migration process order (§Migration process, 9 steps) → maps 1:1 onto Tasks 1–17 in the same order. ✅
- Non-goals (§Non-goals) → no task introduces content changes, new tokens, state-management libraries, a backend, or NgModules. ✅

**Placeholder scan:** no "TBD"/"TODO"/"implement later" strings; every code block is complete, runnable code; every step that touches an existing generated file gives either full replacement text or an exact find/replace pair.

**Type consistency:** `Project`/`NavItem`/`ExperienceEntry`/`Competency`/`TechArsenalGroup` (Task 6) are used with identical field names in every consuming task (10–15) — checked `p.heroImage`/`heroTitle`/`heroTagline`/`heroTags` (optional, `!`-asserted only in Home where `featuredProjectSlugs` guarantees presence), `item.duration`/`role`/`org`/`highlights`, `c.label`/`percent`, `group.name`/`icon`/`items`. `IconComponent`'s `extraClass` input name is used consistently (not `class`) in every call site across Tasks 8, 10, 12, 13, 14, 15. `RevealDirective`'s `appRevealDelay` input alias is used consistently (not `delay`) everywhere. `CompetencyBarComponent`'s `label`/`percent` inputs match its one call site in Task 12.
