# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters, hiring managers, freelance/contract prospects, and general dev-community contacts who land on the site to evaluate Amit Jangid as a full-stack software engineer — either for full-time employment or project-based work. Both intents are in scope; the site does not favor one over the other.

## Product Purpose

A personal portfolio site for Amit Jangid. It exists to give a visitor enough evidence of his skills and experience to decide to reach out — for a job, a contract, or a professional connection. Success is a visitor leaving with a clear sense of his stack/experience and an obvious way to contact him.

## Positioning

Generalist full-stack engineer — confirmed deliberately, not defaulted. Amit chose not to commit to a narrow niche (e.g. fintech, dev tooling, AI/ML); breadth across frontend, backend, and infra is the position, at least for now.

## Operating Context

A cold visitor (recruiter, prospective client, or peer) browsing casually, likely scanning quickly rather than reading closely, looking to confirm stack, experience, and a contact path within a short visit.

## Capabilities and Constraints

Client-side React app (Vite + react-router-dom), no backend. The contact form has no server behind it — it builds a `mailto:` link rather than submitting anywhere. No CMS or content-management need has been identified — content changes happen by editing source.

## Evidence on Hand

None yet. Amit has no real resume, project links, GitHub, LinkedIn, or testimonials ready to use. All placeholder content lives in `src/data/site.js`: the name "Amit Jangid" was inferred from his email address and is unconfirmed, and the bio, all four listed projects, the experience timeline, the skills list, and the contact links (email/GitHub/LinkedIn) are fabricated scaffolding. None of it is product fact — it must not be treated as evidence in future work, and should be replaced once Amit supplies real material.

## Product Principles

- Breadth over niche: represent Amit as a generalist across frontend, backend, and infra; don't narrow to a fabricated specialty.
- Placeholder integrity: invented content is scaffolding, not fact — keep it flagged until replaced, never let it pass silently as evidence.
- Fast legibility for a cold visitor: a recruiter or client arrives with no context and should leave knowing his skill set and how to reach him within a short visit.
- Single audience, dual intent: employment and freelance/contract inquiries are both in scope; don't design content that only serves one.
