#!/bin/sh
set -e

# Load default environment variables
. /docker-defaults.sh

# echo "Generating Angular runtime configuration..."
# envsubst \
# < /usr/share/nginx/html/assets/env/env.template.js \
# > /usr/share/nginx/html/assets/env/env.js

echo "Generating nginx configuration..."

envsubst '${NGINX_CSP} ${NGINX_HSTS} ${NGINX_PERMISSIONS_POLICY} ${NGINX_CONNECT_SRC} ${NGINX_LISTEN_PORT} ${NGINX_SERVER_NAME}' \
< /etc/nginx/templates/default.conf.template \
> /etc/nginx/conf.d/default.conf

echo "Generating security headers..."

envsubst '${NGINX_CSP} ${NGINX_HSTS} ${NGINX_PERMISSIONS_POLICY}' \
< /etc/nginx/templates/security-headers.conf.template \
> /etc/nginx/conf.d/security-headers.conf

nginx -t

exec nginx -g "daemon off;"
