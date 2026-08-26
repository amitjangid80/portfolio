---
name: Amit Jangid — Portfolio (Stitch port)
description: A dark glassmorphic "pro-tool" portfolio — deep charcoal surfaces, one electric-blue accent, ported from a Google Stitch concept into Tailwind v4.
colors:
  background: "#0b1326"
  surface: "#0b1326"
  surface-variant: "#2d3449"
  surface-container-lowest: "#060e20"
  surface-container-low: "#131b2e"
  surface-container: "#171f33"
  surface-container-high: "#222a3d"
  surface-container-highest: "#2d3449"
  on-surface: "#dae2fd"
  on-surface-variant: "#c1c6d7"
  outline: "#8b90a0"
  outline-variant: "#414755"
  primary: "#adc6ff"
  on-primary: "#002e69"
  primary-container: "#4b8eff"
  primary-fixed: "#d8e2ff"
  primary-fixed-dim: "#adc6ff"
  inverse-primary: "#005bc1"
  secondary: "#4edea3"
  secondary-container: "#00a572"
  tertiary: "#ffb595"
  error: "#ffb4ab"
typography:
  display:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "40px/48px (mobile) – 64px/72px (desktop), -0.02em tracking, weight 700"
  headline:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px/32px – 32px/40px, weight 600"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px/24px – 18px/28px, weight 400"
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px/20px, 0.05em tracking, weight 500"
rounded:
  DEFAULT: "0.25rem"
  lg: "0.5rem"
  xl: "0.75rem"
  full: "9999px"
spacing:
  xs: "4px (space-1)"
  sm: "8px (space-2)"
  md: "16px (space-4)"
  lg: "24px (space-6)"
  xl: "40px (space-10)"
  xxl: "80px (space-20)"
components:
  button-primary:
    backgroundColor: "linear-gradient(135deg, {colors.primary-container} 0%, {colors.inverse-primary} 100%)"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0.75rem 1.5rem"
  glass-panel:
    backgroundColor: "rgba(30, 41, 59, 0.55)"
    border: "1px solid rgba(255,255,255,0.1)"
    backdropFilter: "blur(12px)"
    rounded: "{rounded.xl}"
  project-tile:
    backgroundColor: "cover image, gradient-to-t scrim from {colors.background}"
    rounded: "{rounded.xl}"
    padding: "1.5rem–2rem overlay text block"
---

# Design System: Amit Jangid — Portfolio (Stitch port)

## Overview

This design replaced an earlier "System Diagram" whiteboard concept wholesale. It was not designed through Impeccable's direction-selection process — it is a direct, faithful port of a Google Stitch-generated concept ("Elite Professional Digital Portfolio") into this codebase, at the explicit instruction to use Stitch's HTML/CSS as-is and rebuild it on Tailwind v4.

**Content note:** content is real, sourced from the site owner's resume (name, role, employers, dates, experience summaries, skills, and both projects) — see `src/app/data/site.ts`. Certifications and awards sections were never part of this build and remain absent rather than fabricated. Social links point to real LinkedIn/GitHub profiles; Twitter and Dribbble were dropped entirely since neither applies.

**Visual identity:** a dark, glassmorphic "pro-tool" aesthetic — deep charcoal/navy surfaces (`#0b1326`), frosted glass panels (`backdrop-filter: blur(12px)` over translucent surface fills), one committed electric-blue primary (`#adc6ff` text / `#4b8eff`→`#005bc1` gradient for CTAs and accents), a secondary emerald (`#4edea3`) reserved for backend/skill accents, and large soft "ambient" shadows (`0 20px 40px rgba(0,0,0,0.4)`) rather than tight card shadows. Full-bleed photographic/AI-generated imagery (hero portrait, project thumbnails) sits under gradient scrims, distinguishing this from the previous whiteboard/line-art world entirely.

**Key characteristics:**
- Deep charcoal/navy ground (`--color-background`), never pure black
- One committed gradient accent (electric blue) for every CTA and active state; emerald is a secondary skill-category accent only, not a co-equal brand color
- Three-typeface role split: Hanken Grotesk for display/headline, Inter for body copy, Geist for labels/UI chrome
- Frosted glass panels (`.glass-panel`) as the primary card surface, over full-bleed photography for project tiles
- Scroll-triggered reveal (opacity + 24px translateY) on every section, via `Reveal.jsx` / IntersectionObserver
- Material Symbols Outlined ligature icon font for all iconography — no bundled SVG icon set
- Gradient text (`.gradient-text`) has been retired (see Colors → Named Rules); the Home hero's "Excellence" now uses solid `text-primary`

## Colors

A near-monochrome dark palette (background → surface-container ladder) carries structure; one electric-blue primary carries all CTA/active meaning, with emerald and a warm tertiary reserved for narrow secondary uses.

### Primary
- **Electric Blue** (`--color-primary`, `#adc6ff`): primary text/icon accent — active nav state, links, "Available for new opportunities" pill, primary skill-bar fill.
- **Primary Container** (`#4b8eff`) → **Inverse Primary** (`#005bc1`): the two stops of `.btn-gradient`, the CTA gradient used on every primary button and the hero gradient-text.

### Secondary / Tertiary
- **Emerald** (`--color-secondary`, `#4edea3`): backend-skill-group accent (icon + bar fill) and footer social-link hover only — never used for CTAs.
- **Tertiary** (`#ffb595`): Achievements-card icon accent only.
- **Tertiary Container** (`--color-tertiary-container`, `#ef6719`, warm orange): Skills page "Infra & DevOps" panel accent only — icon, tag chips, and hover-state border/text on the infra tool grid. A distinct token from Tertiary; the two are never used interchangeably.
- **Error** (`#ffb4ab`): Security-skill-group accent (icon + tag chips) — a semantic-looking color used here purely as a fourth categorical accent, not for error states in this build (there is no form-validation UI yet).

### Neutral (surface ladder)
- **Background / Surface** (`#0b1326`): page ground.
- **Surface Container Lowest → Highest** (`#060e20` → `#131b2e` → `#171f33` → `#222a3d` → `#2d3449`): a five-step elevation ladder — footer uses lowest, glass-panel cards use low/high, chip backgrounds use lowest.
- **On-Surface** (`#dae2fd`) / **On-Surface-Variant** (`#c1c6d7`): primary and secondary text.
- **Outline / Outline-Variant** (`#8b90a0` / `#414755`): borders on ghost buttons and inputs.

### Named Rules
**The One Gradient Rule (updated again).** The electric-blue gradient (`#4b8eff → #005bc1`, `.btn-gradient`) remains the only gradient *fill* in the system — used on CTA buttons that still carry it (e.g. Contact's Send Message). Gradient *text* was retired during the Home redesign (zero instances), then reintroduced by the second Skills redesign ("SkillsScreen-Final"): "Arsenal" in the Skills H1 uses `bg-gradient-to-r from-primary to-secondary` (blue → emerald) — a different stop pair than the old, retired `.gradient-text` class (blue → light-blue), applied inline via Tailwind utilities rather than a shared CSS class. That treatment was then extended, deliberately, to the accent word in every page header site-wide (About, Projects, Contact, Skills — see "Unified Page Header" below) so the h1 accent reads consistently across pages, still the one gradient-text stop pair. Home's hero headline ("Excellence") is the one holdout, staying solid `text-primary`, since Home's bento hero isn't a page-header in this sense. Emerald, tertiary, and error never gain a gradient treatment outside this pair.

**Unified Page Header.** About, Projects, Contact, and Skills all share one header shape, ported from Skills' original pattern: `<header appReveal class="flex flex-col gap-4">` containing (1) an eyebrow pill — `inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 w-fit`, a `terminal` icon plus a short uppercase `font-label` tag (System Profile / Project Archive / Transmission Protocol / System Capabilities); (2) an `<h1>` at `text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] font-bold`, its accent word/phrase in the shared gradient-text treatment; (3) a `font-body text-lg text-on-surface-variant` intro paragraph. Every part of the header — including the intro paragraph, which dropped its earlier `max-w-2xl` cap — now spans the full container width; only Home's bento hero (a different layout entirely) keeps width-constrained copy. All four are left-aligned at every breakpoint — Contact's old centered underline-bar heading and Projects' old centered "My Work" are both retired in favor of this. Project-detail's per-project `<h1>` (inside its image hero banner) is intentionally NOT part of this — it's a project name, not a page title.

## Typography

**Display/Headline Font:** Hanken Grotesk — headings only, weight 600–700.
**Body Font:** Inter — all reading copy.
**Label Font:** Geist — nav, buttons, tags, form labels, uppercase timeline dates.

### Hierarchy
- **Display** (`text-[64px] leading-[72px]`, desktop) / (`text-[40px] leading-[48px]`, mobile), `-0.02em` tracking, 700: hero headline, page H1s (About, Projects, Contact), contact-teaser headline.
- **Headline** (`text-2xl`/32px `font-semibold`): section H2s, card titles (timeline role, skill-group name, project-detail name).
- **Body** (`text-base`/16px–`text-lg`/18px, 400): paragraphs, card descriptions.
- **Label** (`text-sm`/14px, 500, Geist): nav links, buttons, tags, timeline duration, form field labels.

### Named Rules
**The Three-Role Rule.** Hanken Grotesk for display/headline, Inter for body, Geist for label/UI chrome — never swapped. (Home briefly ran an all-mono "Industrial HUD" exception; that was reverted so every page now holds this rule uniformly — see Components → Home Page.)

## Layout

Content sits in a `max-w-[1200px]` centered column with `px-6`/`px-10` side padding. The site is multi-page (real routes: `/`, `/about`, `/skills`, `/projects`, `/projects/:slug`, `/contact`), not a single scrolling page with anchor nav — a deliberate structural change from the previous build, matching Stitch's separately-generated per-page screens. `/about` folds only Experience into itself as an in-page section (`#experience`); Skills is its own top-level route (Stitch later split it out from About into a dedicated page — see Components → Skills Page). The nav links anchor-only entries by hash but never marks them as a separately "active" route.

Grids scale by content: the About skills/achievements area is a 3-column bento (`md:grid-cols-3`, achievements card spans 2 rows), the Projects grid is 1→2 columns at `md:` (5 projects total, only 3 marked featured), the Home featured-work mosaic is a tile grid with one large tile plus one standard tile per remaining featured project (currently 3 featured projects).

**Site-wide background.** The `.hud-tech-grid` dot/line pattern stays as the base texture. Layered on top: 3 `fixed`, slowly-pulsing blurred `.light-leak` circles (primary/secondary/primary, `animate-pulse-slow`, 4s) and 5 `fixed` particles drifting bottom-to-top (`.particle`, `animate-particle-float`/`-delayed`, 15–25s each) — the "Holographic Glass OS" ambient decor, originally built for the About page's own screen, then promoted to `app.ts`'s root wrapper and removed from About's template so it renders once, behind every route, rather than being duplicated per page. This replaced the two static `bg-primary/5`/`bg-secondary/5` blur blobs the earlier version of this background used.

## Elevation & Depth

Depth now comes from `.holo-glass-panel` itself (see Components → Glass Panel Card): its own dual box-shadow (an outer `0 8px 32px rgba(0,0,0,0.5)` drop shadow + an inset primary-tinted glow) replaces the old standalone `.ambient-shadow` as the card-elevation system. `.ambient-shadow` (`0 20px 40px rgba(0,0,0,0.4)`) still exists and is used exactly once — Project Detail's hero image banner, which isn't a card.

### Named Rules
**The One-Card Rule.** Every card, panel and tile site-wide — Home's bento grid, Skills' three panels, About's bio/stat/timeline/image panels, Projects' grid cards, Project Detail's four info cards, Contact's status/social/location/form cards — is `.holo-glass-panel`. There is exactly one card primitive; page-specific panel classes (`.hud-panel`/`.hud-glow-hover`, `.bento-panel`, the old `.glass-panel`) were retired once every usage was migrated. See Components → Glass Panel Card for what it looks like and Do's and Don'ts below for the one CSS hazard this class carries.

**The One-Hover Rule.** Every `.holo-glass-panel` lifts 4px, brightens its border, and gains a soft primary-tinted glow on hover — baked directly into the class (`.holo-glass-panel:hover`), not re-authored per instance. Elements that also carry `appReveal` additionally need `.reveal-border-hover` alongside both classes (see Do's and Don'ts); elements without their own `appReveal` (Contact's small social-link tiles, which reveal as one unit via their grid wrapper instead — see below) get their hover transition from a plain `transition-all duration-300` instead, since there's no reveal-fade on the tile itself to protect. Deliberately **not** applied to: full-bleed image tiles that already have their own hover language (Home's Featured Work tiles and the Projects grid's inner image, both `group-hover:scale-105`/`group-hover:opacity-100` zoom).

## Shapes

`rounded-xl` (0.75rem / 12px, Tailwind's default) on every card and image container — glass panels, project tiles, form fields' parent card, the hero portrait frame. `rounded-lg` (0.5rem / 8px) on buttons and inputs. `rounded-full` on pills (nav CTA is square-cornered by exception — it's a filled gradient button, not a pill), skill tags, and the "available for opportunities" hero badge. No irregular/hand-drawn radii in this world — corners are clean and consistent, unlike the previous "sketchy" build.

## Components

### Nav
Site-wide HUD/terminal skin, ported from the Skills page's "SkillsScreen-Final-2" screen and applied globally (superseding the earlier plain glass-panel nav on every page, not just Skills). Fixed, full-width, `bg-surface/80` with `backdrop-blur-xl`, `border-b border-primary/20`, `h-16` (was `h-20`). Brand carries a `memory` icon + a small pulsing-dot "Online" badge (`secondary` accent). Links are uppercase, mono (Geist), `text-xs tracking-widest`; the active route wraps itself in literal `[ ]` brackets and turns primary instead of getting an underline — anchor-only entries (Skills, Experience) never receive the active state, since they don't own a distinct route. CTA is a bracket-cornered outlined button (`border-primary/30`, corner brackets top-left/bottom-right) rather than the gradient-fill button — the gradient stays reserved for in-page CTAs (Home hero, contact form). "Let's Connect" renders in `text-secondary` (the same emerald used for Home's "50+" stat) against the primary-tinted border/background, a deliberate two-accent mix; on hover it still inverts to a solid primary fill with `text-background`.

### Buttons
- **Primary (`.btn-gradient`):** electric-blue gradient fill, white text, `rounded-lg`, glow on hover (`box-shadow: 0 0 20px rgba(75,142,255,0.5)`). Still used on non-HUD pages (e.g. Contact's "Execute Transmission").
- **Ghost:** transparent, `outline-variant` border, fills to primary border/text on hover.
- **HUD outline (Nav CTA only):** transparent/`primary/10` fill, `border border-primary`, mono uppercase text, corner-bracket accents (two small absolutely-positioned `<span>`s per opposing corner, not a shared CSS class), inverts to solid primary fill on hover. No gradient, no rounded corners. Home used this treatment briefly and reverted to the standard Primary/Ghost pair above — see Components → Home Page.

### Glass Panel Card
`.holo-glass-panel` — the one card primitive, used everywhere a card/panel/tile exists site-wide, ported from About's "Holographic Glass OS" screen. A diagonal white gradient fill (`rgba(255,255,255,0.05)` → `rgba(255,255,255,0.01)`), heavy `backdrop-filter: blur(40px)`, an asymmetric border (brighter on the top/left edges, simulating light hitting glass from upper-left), a dual box-shadow (outer drop shadow + inset primary-tinted glow), and `rounded-xl`. Hover state (lift + brighter border + bigger glow) is baked into the class itself — see Elevation & Depth → The One-Hover Rule. This retired three earlier, page-scoped panel classes: `.hud-panel`/`.hud-glow-hover` (Skills' HUD look), `.bento-panel` (Home's bento grid), and the original, more subtle `.glass-panel` (About/Projects/Contact's softer glass) — all deleted from `styles.css` once every usage migrated.

### Home Page (`/`)
Briefly ran a bolder "Industrial HUD" aesthetic ported from a Stitch screen ("HomeScreen-Final") — mono/terminal typography throughout, sharp `.hud-corner-*` bracketed panels, a `.hud-scanline` CRT overlay, `.hud-crosshair` marks. That was a page-scoped departure from every other page's softer register, and was reverted: Home now shares the same `.holo-glass-panel` treatment as every other page (see Components → Glass Panel Card) and the same normal Three-Role typography as everywhere else — no more Home exception. `.hud-corner-*`, `.hud-crosshair`, and `.hud-scanline` were deleted from `styles.css` as dead CSS once Home stopped using them.

Content and structure are unchanged from the HUD version: a 12-column grid — a 9-column main area (hero panel with a centered portrait flanked by two stat readouts pulled from `homeAbout.stats`, then a Featured Work grid — 1 large + 2 small cards, same 3 projects as before, now using the same pill-chip/gradient-scrim treatment as the Home mosaic always used pre-HUD) plus a 3-column "Engineering Intent" sidebar panel (icon + heading header, a status readout box, a "Read full bio" link to `/about`) — with a full-width contact module below reusing the same mailto CTA. Buttons reverted to the standard spec (`.btn-gradient` primary / ghost outline), and the hero's "Excellence" is solid `text-primary`, matching the rest of the site — see Colors → Named Rules.

### Project Tile (Home mosaic) / Project Card (Projects grid)
Home: full-bleed background image, `rounded-xl` panel, `bg-gradient-to-t from-background/95` scrim, pill-chip stack tags, overlay title/tagline bottom-left — one large full-width tile + two standard tiles. Projects grid: image top, `.holo-glass-panel` body below with Problem statement, stack chips, "View Case Study" link to `/projects/:slug`.

### About Page (`/about`)
Re-ported a second time, this time near-verbatim, from a later Stitch screen — "About & Experience - YOLO: Holographic Glass OS" — a distinct visual register from every other page: true frosted glass instead of the site's `.glass-panel`/`.hud-panel` families. New primitives, scoped to this page: `.holo-glass-panel` (a 40px-blur panel with a diagonal white gradient fill, asymmetric top/left-brightened border, and a dual box-shadow — outer drop shadow + inset primary-tinted glow — replacing `.glass-panel`/`.ambient-shadow` here, since the name and values genuinely differ from the sitewide `.glass-panel`), plus page-scoped ambient decor mounted directly in the component template (destroyed on navigation, not centralized in `app.ts`): 3 pulsing blurred `.light-leak` circles and 5 slow-drifting `.particle` dots (`animate-particle-float`/`-delayed`, 15-25s each). Layout: a plain (non-pill) eyebrow line + `<h1>` with the accent phrase in the shared gradient-text treatment — About's header deliberately does NOT follow the "Unified Page Header" pill/paragraph shape used by Skills/Projects/Contact, nor does it carry an intro paragraph, since the source screen has neither; a 12-col bento grid holds an 8-col "System Diagnostics" bio card (bio paragraphs + uppercase tag pills + a "STATUS: ONLINE" badge), a 4-col stack of 3 "Telemetry" stat tiles (each with a `.hud-line` accent bar under the value), a full-width "Execution Log" timeline (glowing accent-colored dot per entry — `accentGlow()` — only the first/primary entry gets a colored duration badge, the other two share a neutral one, matching the source), and a full-width "Infrastructure Visualized" image panel (a real downloaded asset, `aboutInfraImg`, with a primary-tint mix-blend overlay) replacing the old empty "System Core" ghost-text placeholder. Two disclosed deviations, both deliberate: (1) the source's own `bg-[#040812]` page background and duplicate nav/footer were not carried over — the site's shared `app-nav`/`app-footer` and centralized `hud-tech-grid` background stay as the single source of truth for chrome, exactly as on every other page; (2) content was updated to match this screen's literal copy (heading "Engineering Digital / Experiences.", eyebrow "Module: Identity_Core", all 3 timeline summaries, Coffee Consumed → `999+`) — fictional placeholder content at the time. Since replaced with real resume content: heading is now "Engineering Scalable / Systems.", the 3 Telemetry stats are Runtime/Team Led/Dev Cycle Cut (all resume-backed), and the timeline now has 6 entries (the 6th, earliest one sourced from LinkedIn rather than the resume) carrying real employers, dates and summaries.

### Contact Page (`/contact`)
Re-ported from a later Stitch screen ("Contact - Command Center") to a "Communication Protocol" terminal framing — same softer glass/`.ambient-shadow` register as About, not the bracket-HUD look. A 3-column grid: a 1-column left sidebar (a "System Status" card with a pulsing-dot "Available" indicator; a social icon grid (`grid-cols-3`) — GitHub/LinkedIn/Email, from `profile` (Twitter and Dribbble were removed entirely, along with their fields on `Profile`, since the site owner has no real presence on either); a decorative `.hud-tech-grid`-textured "Mira Bhayandar, MH, IN" location card, matching the site owner's real location) and a 2-column "Communication Protocol v2.1" form card (`terminal` icon) with terminal-flavored labels — Ident (Name), Return Vector (Email), Subject Classification (a `<select>` of 3 preset options, replacing the old free-text Subject field), Payload (Message) — and an "Execute Transmission" submit button. Submission behavior is unchanged (opens the user's email client via `mailto:`, per `ContactComponent.handleSubmit`). Three disclosed deviations: (1) the source screen's location panel used a hotlinked Google-hosted map image; that dependency was dropped in favor of a plain decorative `.hud-tech-grid` panel, so nothing in the app depends on an external, potentially-expiring asset URL; (2) the source's CTA button uses a one-off `from-primary to-primary-container` gradient — kept on the existing `.btn-gradient` treatment instead, per the One Gradient Rule (no second gradient-fill variant); (3) the previous version's three info cards (Email / Book a Call / Network, including a Calendly link) were dropped entirely — the new source screen has no equivalent, and Email/Network are now covered by the social icon grid.

### Skills Page (`/skills`)
Re-ported a second time from a later Stitch screen ("SkillsScreen-Final", titled "Skills - Command Center (Static Restoration)"), superseding the corner-bracketed "SkillsScreen-Final-2" layout. Still a "Command Center" HUD departure from the rest of the site's glass-panel language, but toned down: panels are plain `.hud-panel .hud-glow-hover rounded-xl` (no `.hud-corner-*` brackets), each with a giant ghost Material icon (10%→20% opacity on hover) bleeding off the top-right corner. A 12-column grid, not three equal columns:
- **Frontend Interface** (`md:col-span-7`, primary accent): 4 skill bars (`<app-competency-bar>`) in a 2-column sub-grid, each a thin (`h-1`) rounded track with a secondary-tinted glowing fill (`.hud-progress-glow-secondary`), width transitioning from 0 on mount. (`.hud-readout-bar`'s diagonal-hatch track from the prior version was removed along with it — dead CSS once the bar style changed.)
- **Backend Services** (`md:col-span-5`, secondary/emerald accent): a list of badge + name + description rows, no bars.
- **Infra & DevOps** (`md:col-span-12`, tertiary-container/orange accent): tag chips (AWS, GCP) in the header, a 2/4-column icon grid below.

The heading's accent word ("Arsenal") uses gradient text again (`from-primary to-secondary`) — see Colors → Named Rules. The page background deliberately was **not** switched to the new source screen's own slightly different grid values (40px cells, white-tinted, vs. this site's 30px/primary-tinted `.hud-tech-grid`) — it now runs on the site-wide centralized background (see Layout → Site-wide HUD background) rather than a page-specific variant.

### Icon
Material Symbols Outlined, ligature-based (`<span className="material-symbols-outlined">icon_name</span>` via `Icon.jsx`) — not a bundled SVG set. Loaded once via Google Fonts in `index.html`.

### Footer
Reskinned to match Home's Industrial HUD treatment (`HomeScreen-Final`): `bg-surface-container-lowest`, `border-t-2 border-primary/30`, mono/uppercase throughout. Brand carries the same pulsing-dot motif as Nav; social links render as bracketed mono tags (`[LINKEDIN]`, `[GITHUB]`, etc.); the copyright line reads as a mock function call (`sys.date("2024").copyright(AMIT.DEV).status("Engineered with precision.")`). Keeps the site's own brand — the source screen's footer used a different, inconsistent brand name ("Architect.io") and swapped Dribbble for a fourth "Email" link; neither was carried over. Originally shipped four links (LinkedIn/GitHub/Twitter/Dribbble); Twitter and Dribbble were later dropped (footer now links LinkedIn/GitHub only) since the site owner doesn't use either.

## Do's and Don'ts

### Do:
- **Do** keep the electric-blue gradient (`.btn-gradient`) as the only gradient fill in the system — `.gradient-text` is retired, don't reintroduce it.
- **Do** use `.holo-glass-panel` for every card/panel/tile, site-wide — don't invent a page-specific panel class. When it's combined with `appReveal`, also add `.reveal-border-hover`: any full `transition` shorthand (from a Tailwind `transition-*` utility, or a component class like `.holo-glass-panel` if it ever grows one) beats `.reveal`'s own transition in the CSS cascade and silently kills the fade-in, since both live in `@layer components`/`@layer utilities` and later-defined always wins for the whole shorthand.
- **Do** hold the three-typeface split: Hanken Grotesk display/headline, Inter body, Geist label.
- **Do** use `rounded-xl` on cards/images and `rounded-lg` on buttons/inputs — no irregular radii.
- **Do** key skill-group bar/chip color off the group's own accent (primary or secondary), never introduce a new accent per group without adding it to `src/index.css`'s `@theme` block first.
- **Do** treat `/about#skills` and `/about#experience` as anchors, not routes — the nav's active-state logic depends on this (`anchor: true` in `src/app/data/site.ts`'s `nav` array).

### Don't:
- **Don't** add a second CTA gradient or a second card/panel class — this world commits to exactly one of each (`.btn-gradient`, `.holo-glass-panel`).
- **Don't** swap the typeface roles (no Geist body copy, no Inter headings).
- **Don't** replace the Material Symbols icon font with an SVG icon library — it's a deliberate zero-dependency choice.
- **Don't** re-fabricate placeholder content — everything in `src/app/data/site.ts` (name, role, employers, dates, experience, skills, projects) is real, sourced from the site owner's resume. Certifications/awards were never part of this build; don't invent a section for them.
