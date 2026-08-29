#!/usr/bin/env sh
set -eu

# As of version 1.19, the official Nginx Docker image supports templates with
# variable substitution. But that uses `envsubst`, which does not allow for
# defaults for missing variables. Here, first use the regular command shell
# to set the defaults:
export NGINX_LISTEN_PORT="${NGINX_LISTEN_PORT:-8686}"
export NGINX_CONNECT_SRC="${NGINX_CONNECT_SRC:-'self'}"
export NGINX_HSTS="${NGINX_HSTS:-max-age=31536000; includeSubDomains}"
export NGINX_SERVER_NAME="${NGINX_SERVER_NAME:-localhost 127.0.0.1 portfolio.amit-jangid.in}"
export NGINX_PERMISSIONS_POLICY="${NGINX_PERMISSIONS_POLICY:-accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), publickey-credentials-get=(), screen-wake-lock=(), usb=(), xr-spatial-tracking=()}"
export NGINX_CSP="${NGINX_CSP:-default-src 'self'; frame-src 'none'; media-src 'none'; child-src 'none'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' https://static.cloudflareinsights.com/beacon.min.js/; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src ${NGINX_CONNECT_SRC}; form-action 'self'; manifest-src 'self'; worker-src 'self' blob:; require-trusted-types-for 'script'; trusted-types angular angular#bundler angular#components angular#unsafe-bypass; upgrade-insecure-requests}"

# Generate security headers include after substituting environment variables
# envsubst '${NGINX_CSP} ${NGINX_HSTS} ${NGINX_PERMISSIONS_POLICY} ${NGINX_CONNECT_SRC}' \
#     < /etc/nginx/security-headers.conf \
#     > /etc/nginx/security-headers.generated.conf

# Due to `set -u` this would fail if not defined and no default was set above
# Finally, let the original Nginx entry point do its work, passing whatever is
# set for CMD. Use `exec` to replace the current process, to trap any signals
# (like Ctrl+C) that Docker may send it:
# exec /docker-entrypoint.sh "$@"
