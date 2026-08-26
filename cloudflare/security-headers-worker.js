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
function cspFor(nonce) {
    return `default-src 'self'; frame-src 'none'; media-src 'none'; child-src 'none'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' 'nonce-${nonce}' https://static.cloudflareinsights.com/beacon.min.js/; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; form-action 'self'; manifest-src 'self'; worker-src 'self' blob:; require-trusted-types-for 'script'; trusted-types angular angular#bundler angular#components angular#unsafe-bypass; upgrade-insecure-requests`;
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

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Loose bound, not a strict RFC 5322 validator — good enough to catch
// obviously-wrong input before it reaches the email API.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactPayload(body) {
    const { name, email, subject, message } = body ?? {};

    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
        return 'Invalid name';
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200) {
        return 'Invalid email';
    }
    if (typeof subject !== 'string' || subject.trim().length === 0 || subject.length > 200) {
        return 'Invalid subject';
    }
    if (typeof message !== 'string' || message.trim().length === 0 || message.length > 5000) {
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
