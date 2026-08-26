// Mirrors nginx/security-headers.conf.template for the GitHub Pages origin.
// Cloudflare sits in front of the domain, fetches from GitHub Pages, and
// injects these headers on the way back to the client since Pages itself
// cannot set custom response headers.

const SECURITY_HEADERS = {
	"Content-Security-Policy":
		"default-src 'self'; frame-src 'none'; media-src 'none'; child-src 'none'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; form-action 'self'; manifest-src 'self'; worker-src 'self' blob:; require-trusted-types-for 'script'; trusted-types angular angular#bundler angular#components angular#unsafe-bypass; upgrade-insecure-requests",
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
	"X-Robots-Tag": "noindex, nofollow",
};

export default {
	async fetch(request) {
		const response = await fetch(request);
		const headers = new Headers(response.headers);

		for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
			headers.set(name, value);
		}

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	},
};
