// Handles POST /api/contact only. Static assets and their security headers are
// served by Workers static assets (public/_headers) without invoking this Worker.

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

const NAME_RE = /^[A-Za-z ]+$/;
// Loose bound, not a strict RFC 5322 validator — good enough to catch
// obviously-wrong input before it reaches the email API.
const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
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
        if (new URL(request.url).pathname !== '/api/contact') {
            return json({ error: 'Not found' }, 404);
        }

        if (request.method !== 'POST') {
            return json({ error: 'Method not allowed' }, 405);
        }

        return handleContact(request, env);
    },
};
