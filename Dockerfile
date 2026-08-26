# Define the base images for Node.js and Nginx
ARG NODE_IMAGE="public.ecr.aws/docker/library/node:24.18.0-alpine"

# Stage 1: Build the Angular application
FROM ${NODE_IMAGE} AS build-step

# Create and set the working directory
RUN mkdir -p /app
WORKDIR /app

# Copy all project files into the container
COPY . .

# Make the setup script executable and run it
RUN chmod +x setup-local.sh
RUN ./setup-local.sh

# Stage 2: Nginx Configuration
FROM fholzer/nginx-brotli:latest

# Set user to root to modify directories and permissions
USER root

# Install Brotli module for Nginx
RUN apk add --no-cache nginx-mod-http-brotli

# Copy custom Nginx configuration template
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/docker-nginx-default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/security-headers.conf.template /etc/nginx/templates/security-headers.conf.template

# Copy any additional Nginx setup scripts
COPY nginx/docker-defaults.sh /
COPY nginx/entrypoint.sh /entrypoint.sh

RUN chmod +x /docker-defaults.sh
RUN chmod +x /entrypoint.sh

# Copy the built Angular app to the Nginx web root
# We now serve the app from root (no context path)
COPY --from=build-step /app/dist/portfolio/browser/ /usr/share/nginx/html/

# Change ownership and permissions for necessary directories and files to the nginx user
RUN mkdir -p /var/cache/nginx /var/log/nginx /app && \
    chown -R nginx:nginx /app && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /app /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to the non-root nginx user
USER nginx

# Expose port 8686 for the application
EXPOSE 8686

# Start Nginx in the foreground
ENTRYPOINT ["/entrypoint.sh"]
