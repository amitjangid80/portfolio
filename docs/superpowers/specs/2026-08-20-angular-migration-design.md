# Angular v22 + Tailwind v4 Migration — Design

**Status:** Approved by Amit 2026-08-20. Ready for implementation planning.

## Goal

Replace the current Vite + React 19 + react-router-dom + Tailwind v4 portfolio with an equivalent Angular v22 + Tailwind v4 app, in the same repository, at the repo root. The non-negotiable constraint: **animations, layouts, and navigation behavior must be preserved exactly** — this is a framework port, not a redesign. Common, genuinely-repeated markup may be extracted into shared components/directives along the way.

## Current state (source of truth for the port)

- **Stack:** Vite, React 19, react-router-dom v7, Tailwind v4 (`@tailwindcss/vite`, CSS-first `@theme` config in `src/index.css`), oxlint.
- **Routes (`src/App.jsx`):** `/` (Home), `/about` (About), `/skills` (Skills), `/projects` (Projects), `/projects/:slug` (ProjectDetail), `/contact` (Contact). Shell: `<ScrollToTop /><Nav /><main><Routes>...</Routes></main><Footer />`.
- **Nav (`src/Nav.jsx`):** fixed, blurred header; flat 5-item nav array (`src/data/site.js`'s `nav`, no anchor-only entries remain); manual `isActive(pathname, to, anchor)` prefix-match logic for the active-link underline; mobile burger menu (local `open` state).
- **ScrollToTop (`src/ScrollToTop.jsx`):** `useLocation()` + `useEffect` → `window.scrollTo(0,0)` on every `pathname` change.
- **Footer (`src/Footer.jsx`):** static, brand + social links + copyright, from `profile` in `site.js`.
- **Shared components:**
  - `Icon.jsx` — thin wrapper emitting `<span class="material-symbols-outlined">{name}</span>` with an optional `size`.
  - `Reveal.jsx` — wrapper component (`as` prop, default `div`) that observes itself with `IntersectionObserver`, adds `is-visible` once intersecting (threshold 0.15, disconnects after first fire), plus an optional `delay` prop (1–5) adding `reveal-delay-N`.
- **Pages (`src/pages/`):** `Home.jsx`, `About.jsx`, `Skills.jsx` (contains a page-local `CompetencyBar` function component — animates a bar's width from 0 to target% via `setTimeout` on mount), `Projects.jsx`, `ProjectDetail.jsx`, `Contact.jsx` (controlled form building a `mailto:` link on submit — no backend).
- **Data (`src/data/site.js`):** `profile`, `nav`, `heroPortraitImg`/`aboutPortraitImg` (imported JPGs), `about`, `homeAbout`, `experience[]`, `skillsIntro`, `competencies[]`, `techArsenal[]`, `certifications[]`, `projects[]` (with `slug`, `name`, `problem`, `stack[]`, `image`, and Home-mosaic-only `heroImage`/`heroTitle`/`heroTagline`/`heroTags`), `featuredProjectSlugs[]`.
- **Global styles (`src/index.css`):** Tailwind v4 `@import "tailwindcss"` + `@theme` block (colors, `--font-display`/`--font-body`/`--font-label`), plus hand-written utility classes: `.material-symbols-outlined` (icon font face), `.ambient-shadow`, `.glass-panel`, `.btn-gradient`, `.gradient-text`, `.reveal`/`.reveal.is-visible`/`.reveal-delay-1..5`, `@keyframes float`/`.animate-float`.
- **Assets (`src/assets/stitch/*.jpg`):** 9 images (hero portraits, about portrait, project hero/card images), imported in `site.js` and bundled by Vite.
- **`index.html`:** Google Fonts links for Geist/Hanken Grotesk/Inter/Material Symbols Outlined; no framework-specific markup otherwise.
- Design system is documented in `DESIGN.md` and `.impeccable/design.json` at the repo root — authoritative reference for exact tokens/values during the port.

## Decisions (from brainstorming Q&A)

1. **Location:** same repo, root-level replacement. Backup first.
2. **Backup:** copy the entire current app into `_react-backup/` (committed), plus a `pre-angular-migration` git tag on the current commit. `_react-backup/` is deleted in a final cleanup commit only when Amit confirms the migration is verified — never removed unprompted.
3. **Rendering mode:** static prerendering (SSG) via Angular's built-in prerender support — not a plain SPA, not server-rendered-per-request. Output is static files, deployable anywhere. Any browser-only API (the reveal directive's `IntersectionObserver`, `window.scrollTo`, etc.) must be guarded for the prerender build (`isPlatformBrowser` / `afterNextRender`).
4. **Tests:** none. Matches the current project's zero-test scope.
5. **Linting:** ESLint + `angular-eslint`, standard Angular CLI setup.
6. **Component/module style:** standalone components only, no `NgModule`s (Angular v22 default/idiomatic).
7. **Folder structure:** feature/page-based, mirroring the current React layout (see below) — not the classic `core/shared/features` enterprise layering, which is unnecessary ceremony for a ~6-route personal site.
8. **Animation strategy:** direct, literal port of the existing CSS/JS mechanics — **not** a rewrite through `@angular/animations`. Global CSS (transitions, keyframes, the `.reveal` system) is copied verbatim; `Reveal.jsx` becomes an `appReveal` attribute directive (not a wrapping component — Angular has no equivalent of React's `as` prop pattern, so a directive on the real host element is the correct translation) replicating the same IntersectionObserver logic and class toggling; the competency-bar width animation ports into its own small component with the same `setTimeout`-then-transition mechanism.
9. **Routing conveniences to adopt** (these simplify vs. the React version, they don't change behavior): `routerLinkActive` replaces the manual `isActive()` function; `withInMemoryScrolling({ scrollPositionRestoration: 'top' })` replaces the custom `ScrollToTop` component.
10. **Shared components to extract:** `Icon` and the `appReveal` directive (already effectively shared in React). Do **not** force Home's mosaic project tiles and the Projects-grid project cards into one shared component — they're visually distinct enough that unifying them risks the "keep layouts as-is" constraint. Watch for other genuinely 3+-times-repeated markup (e.g. the tech/stack chip pill) during the port and extract opportunistically; don't pre-plan beyond what's listed here.

## Target folder structure

```
src/
  app/
    layout/
      nav/                    Nav component (standalone)
      footer/                 Footer component (standalone)
    pages/
      home/
      about/
      skills/
        competency-bar/       page-local sub-component (not shared — matches current scope)
      projects/
      project-detail/
      contact/
    shared/
      icon/                   Icon component
      reveal.directive.ts     appReveal attribute directive
    data/
      site.ts                 typed port of site.js (interfaces + consts)
    app.component.ts          shell: Nav + <router-outlet> + Footer
    app.routes.ts
    app.config.ts             providers: router (withInMemoryScrolling), etc.
  styles.css                  global Tailwind v4 @theme + custom classes (ported verbatim)
public/
  images/                     the 9 ported images, referenced by path from site.ts
index.html
```

## Data model (`src/app/data/site.ts`)

Port every export from `site.js` 1:1, adding TypeScript interfaces (this is the one deliberate TS-ification beyond a literal port — low-risk, idiomatic for a TS-first framework):

```ts
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
export interface ExperienceEntry { role: string; org: string; duration: string; highlights: string[]; }
export interface Competency { label: string; percent: number; }
export interface TechArsenalGroup { name: string; icon: string; items: string[]; }
export interface NavItem { label: string; to: string; }
```

Same values, same shape, images referenced as `/images/<file>.jpg` string paths instead of Vite module imports.

## Routing (`src/app/app.routes.ts`)

```ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/:slug', component: ProjectDetailComponent },
  { path: 'contact', component: ContactComponent },
];
```

`app.config.ts` provides the router with `withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'disabled' })`.

## SSG / prerender

- `ng add @angular/ssr`, configure `outputMode`/prerender per Angular CLI's current SSG support.
- The 5 static routes prerender directly.
- `projects/:slug` needs a `getPrerenderParams()` (or equivalent current-CLI mechanism) that reads the slug list from `site.ts`'s `projects[]` so every project detail page is generated at build time.
- `appReveal` directive: guard `IntersectionObserver` construction behind `isPlatformBrowser(this.platformId)`; on the server, elements should render already visible (no permanently-hidden content in prerendered HTML) so it fails gracefully rather than shipping `opacity:0` content to crawlers/no-JS.
- `ScrollToTop`-equivalent behavior comes from the router config (item 9 above), not custom code — nothing extra to guard there.

## Component → component mapping

| React | Angular |
|---|---|
| `App.jsx` | `app.component.ts` (shell) + `app.routes.ts` + `app.config.ts` |
| `ScrollToTop.jsx` | deleted — replaced by router's `withInMemoryScrolling` |
| `Nav.jsx` | `layout/nav/nav.component.ts` — `routerLinkActive` replaces manual `isActive()` |
| `Footer.jsx` | `layout/footer/footer.component.ts` |
| `components/Icon.jsx` | `shared/icon/icon.component.ts` |
| `components/Reveal.jsx` | `shared/reveal.directive.ts` (`appReveal`, attribute directive) |
| `pages/Home.jsx` | `pages/home/home.component.ts` |
| `pages/About.jsx` | `pages/about/about.component.ts` |
| `pages/Skills.jsx` + inline `CompetencyBar` | `pages/skills/skills.component.ts` + `pages/skills/competency-bar/competency-bar.component.ts` |
| `pages/Projects.jsx` | `pages/projects/projects.component.ts` |
| `pages/ProjectDetail.jsx` | `pages/project-detail/project-detail.component.ts` |
| `pages/Contact.jsx` | `pages/contact/contact.component.ts` |
| `data/site.js` | `data/site.ts` (typed) |
| `index.css` | `styles.css` (same `@theme` + custom classes, ported verbatim) |

## Tooling

- Angular CLI, esbuild-based application builder (current default).
- Tailwind v4 via its official Angular/PostCSS integration; same `@theme` tokens copied from `DESIGN.md`/current `index.css` — visually identical output, no token changes.
- ESLint + `angular-eslint` (`ng add @angular-eslint/schematics` or current equivalent).
- No test runner configured.
- `package.json` scripts should keep the same shape where sensible (`start`/`build` at minimum); replaces `dev`/`build`/`lint`/`preview` from the Vite setup with their Angular CLI equivalents.

## Assets

- The 9 images in `src/assets/stitch/*.jpg` move to `public/images/*.jpg` (same filenames), referenced by absolute path string from `site.ts` instead of ES module imports.
- Google Fonts `<link>` tags in `index.html` copied over unchanged (Geist, Hanken Grotesk, Inter, Material Symbols Outlined).

## Migration process (order of operations for the implementation plan)

1. Create `_react-backup/` (full copy of the current app) + `pre-angular-migration` git tag. Commit.
2. Scaffold a new Angular v22 workspace at the repo root (`ng new` with standalone components, SSG/SSR enabled, Tailwind added per its Angular integration, ESLint + angular-eslint added). This will conflict with existing root files (`package.json`, `index.html`, etc.) — resolve by replacing them, since the originals are safe in `_react-backup/`.
3. Port global styles (`styles.css`) and data (`site.ts`) first — everything else depends on these.
4. Port shared pieces next: `Icon`, `appReveal` directive, `CompetencyBar`.
5. Port layout: `Nav`, `Footer`, `app.component.ts`, `app.routes.ts`, `app.config.ts` (including the router scroll config).
6. Port pages one at a time, verifying each against the live `_react-backup/` app (or the already-captured `.impeccable/review/*.png` screenshots) before moving to the next: Home → About → Skills → Projects → ProjectDetail → Contact.
7. Wire up SSG prerendering, including the dynamic `projects/:slug` params.
8. Full-site verification pass: build, prerender, visually diff every route (desktop + mobile) against the backup/screenshots, exactly as was done when the Stitch design was first ported.
9. Report to Amit; `_react-backup/` and the git tag stay in place until he confirms and asks for cleanup.

## Non-goals / explicitly out of scope

- No content changes — all placeholder copy (name, employers, stats, certifications, project problem statements) carries over unchanged.
- No new design-system tokens or visual changes of any kind — pixel-parity with the current site is the bar.
- No state-management library (NgRx etc.) — app state is trivial (mobile-nav-open toggle, contact form fields, competency-bar animation progress) and fits plain component state/signals.
- No backend — the contact form keeps building a `mailto:` link client-side, same as today.
- No NgModules.
