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
	"Cross-Origin-Embedder-Policy": "require-corp",
	"Cross-Origin-Opener-Policy": "same-origin",
	"Cross-Origin-Resource-Policy": "same-origin",
	"Origin-Agent-Cluster": "?1",
	"Permissions-Policy":
		"accelerometer=(), ambient-light-sensor=(), autoplay=(), bluetooth=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), publickey-credentials-get=(), screen-wake-lock=(), usb=(), xr-spatial-tracking=()",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Strict-Transport-Security": "max-age=31536000; includeSubDomains",
	"X-Content-Type-Options": "nosniff",
	"X-DNS-Prefetch-Control": "off",
	"X-Frame-Options": "DENY",
	"X-Permitted-Cross-Domain-Policies": "none",
};

function randomNonce() {
	const bytes = crypto.getRandomValues(new Uint8Array(16));

	return btoa(String.fromCharCode(...bytes));
}

export default {
	async fetch(request) {
		const response = await fetch(request);
		const headers = new Headers(response.headers);

		for (const [name, value] of Object.entries(STATIC_HEADERS)) {
			headers.set(name, value);
		}

		headers.set("Content-Security-Policy", cspFor(randomNonce()));

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	},
};
