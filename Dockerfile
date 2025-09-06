# Define the base images for Node.js and Nginx
ARG NGINX_IMAGE="public.ecr.aws/docker/library/nginx:alpine"
ARG NODE_IMAGE="public.ecr.aws/docker/library/node:22.16.0-alpine"

# Stage 1: Build the Angular application
FROM ${NODE_IMAGE} AS build-step

# Create and set the working directory
RUN mkdir -p /app
WORKDIR /app

# Copy all project files into the container
COPY . /app

# Make the setup script executable and run it
RUN chmod +x /app/setup-local.sh
RUN /app/setup-local.sh

# Stage 2: Serve the built app with Nginx
FROM ${NGINX_IMAGE} AS runner

# Copy custom Nginx configuration
COPY nginx/docker-nginx-default.conf /etc/nginx/conf.d/default.conf

# Copy any additional Nginx setup scripts
COPY nginx/docker-defaults.sh /

# Copy the built Angular app from the previous stage to the Nginx html directory
COPY --from=build-step /app/dist/portfolio-ui/browser/ /usr/share/nginx/html/portfolio

# Expose port 8484 for the application
EXPOSE 8484

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
