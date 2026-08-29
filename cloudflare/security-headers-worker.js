// Mirrors nginx/security-headers.conf.template for the GitHub Pages origin.
// Cloudflare sits in front of the domain, fetches from GitHub Pages, and
// injects these headers on the way back to the client since Pages itself
// cannot set custom response headers.
//
// CSP script-src carries a per-request nonce instead of 'unsafe-inline'.
// Cloudflare's Bot Fight Mode (JS Detections) injects its own inline script
// into every response and cannot be turned off on the Free plan; Cloudflare
// parses the outgoing CSP header and stamps that same nonce onto its
// injected script, so it executes without weakening script-src for
// everything else.
//
// Angular's own SSG output also ships small inline bootstrap scripts for
// its event-delegation/hydration ("jsaction") system, baked statically at
// build time — a per-request nonce can't cover these since they're fixed
// bytes in the static HTML, not something the Worker injects. Allowlisted
// by sha256 hash instead (the CSP-spec-correct mechanism for known-static
// inline content). Three distinct scripts exist across the site today:
// the shared framework "contract" script, the standard bootstrap call
// (most pages), and the contact page's bootstrap call (registers extra
// event types for its form). Re-derive these if Angular's version changes
// or a page's event bindings change — a stale hash just re-blocks that
// script, it doesn't silently allow anything unintended.
const ANGULAR_INLINE_SCRIPT_HASHES = [
    "'sha256-VM2mZqyEQZoLzoTrp5EigFvzQ0+f1wSeBuoOn95WHCg='", // ng-event-dispatch-contract
    "'sha256-8sGKvDKC8crv9OBcqEMvqrNDWlm1/80h7NJpJzqOnLI='", // __jsaction_bootstrap, standard pages
    "'sha256-Ij8wq2bQuGJ9gO7nLSrw32dIdcfhGiyavxPr53LsDo8='", // __jsaction_bootstrap, /contact
];

function cspFor(nonce) {
    const scriptSrc = `script-src 'self' 'nonce-${nonce}' ${ANGULAR_INLINE_SCRIPT_HASHES.join(' ')} https://static.cloudflareinsights.com/beacon.min.js/`;

    return `default-src 'self'; frame-src 'none'; media-src 'none'; child-src 'none'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; form-action 'self'; manifest-src 'self'; worker-src 'self' blob:; require-trusted-types-for 'script'; trusted-types angular angular#bundler angular#components angular#unsafe-bypass; upgrade-insecure-requests`;
}

const STATIC_HEADERS = {
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Origin-Agent-Cluster': '?1',
    'Permissions-Policy':
        'accelerometer=(), ambient-light-sensor=(), autoplay=(), bluetooth=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), publickey-credentials-get=(), screen-wake-lock=(), usb=(), xr-spatial-tracking=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-DNS-Prefetch-Control': 'off',
    'X-Frame-Options': 'DENY',
    'X-Permitted-Cross-Domain-Policies': 'none',
};

function randomNonce() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));

    return btoa(String.fromCharCode(...bytes));
}

function json(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

// GitHub Pages does not serve dot-prefixed paths at all (confirmed: even
// .nojekyll 404s despite being present in the deployed artifact) — this
// isn't Jekyll's build-time exclusion, .nojekyll doesn't fix it. Served
// from the Worker instead, same pattern as /api/contact.
const SECURITY_TXT = `Contact: mailto:contact.amit.jangid@gmail.com
Expires: 2027-08-29T00:00:00.000Z
Preferred-Languages: en
Canonical: https://portfolio.amit-jangid.in/.well-known/security.txt
`;

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const NAME_RE = /^[A-Za-z ]+$/;
// Loose bound, not a strict RFC 5322 validator — good enough to catch
// obviously-wrong input before it reaches the email API.
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const SUBJECT_RE = /^[A-Za-z0-9 ]+$/;
// Same alphanumeric-plus-space rule as subject, extended with the common
// punctuation a real message needs (periods, commas, apostrophes, etc.)
// and newlines, since this comes from a multi-line textarea.
const MESSAGE_RE = /^[A-Za-z0-9 .,!?'\-:\r\n]+$/;

function validateContactPayload(body) {
    const { name, email, subject, message } = body ?? {};

    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100 || !NAME_RE.test(name)) {
        return 'Invalid name';
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200) {
        return 'Invalid email';
    }
    if (typeof subject !== 'string' || subject.trim().length === 0 || subject.length > 200 || !SUBJECT_RE.test(subject)) {
        return 'Invalid subject';
    }
    if (typeof message !== 'string' || message.trim().length === 0 || message.length > 5000 || !MESSAGE_RE.test(message)) {
        return 'Invalid message';
    }
    return null;
}

async function handleContact(request, env) {
    let body;

    try {
        body = await request.json();
    } catch {
        return json({ error: 'Malformed request body' }, 400);
    }

    const validationError = validateContactPayload(body);

    if (validationError) {
        return json({ error: validationError }, 400);
    }

    if (!env.CONTACT_DESTINATION_EMAIL) {
        console.error('CONTACT_DESTINATION_EMAIL secret is not set');
        return json({ error: 'Failed to send message' }, 500);
    }

    const { name, email, subject, message } = body;

    try {
        await env.EMAIL.send({
            to: env.CONTACT_DESTINATION_EMAIL,
            from: { email: 'contact@amit-jangid.in', name: 'Portfolio Contact Form' },
            replyTo: email,
            subject: `Portfolio contact: ${subject}`,
            text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
            html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
        });
    } catch (err) {
        console.error('Failed to send contact email:', err);
        return json({ error: 'Failed to send message' }, 502);
    }

    return json({ ok: true });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === '/.well-known/security.txt') {
            return new Response(SECURITY_TXT, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        }

        if (url.pathname === '/api/contact') {
            if (request.method !== 'POST') {
                return json({ error: 'Method not allowed' }, 405);
            }

            return handleContact(request, env);
        }

        const response = await fetch(request);
        const headers = new Headers(response.headers);

        for (const [name, value] of Object.entries(STATIC_HEADERS)) {
            headers.set(name, value);
        }

        headers.set('Content-Security-Policy', cspFor(randomNonce()));

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
        });
    },
};
