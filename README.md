# Portfolio

Personal portfolio website for Amit Jangid, built with Angular and Tailwind CSS.

The app includes the main portfolio sections:

- Home
- About
- Projects
- Contact

## Tech Stack

- Angular 21
- TypeScript 6
- Tailwind CSS 4
- PrimeIcons
- Yarn 4
- Nginx Docker image for containerized serving

## Getting Started

Install dependencies:

```bash
yarn install
```

Start the local development server:

```bash
yarn start
```

Open `http://localhost:4200/` in your browser. The app reloads automatically when source files change.

## Available Scripts

```bash
yarn start
```

Runs the Angular development server.

```bash
yarn build
```

Builds the Angular app using the default production configuration.

```bash
yarn build:prod
```

Builds an optimized production bundle with AOT and hashed output files.

```bash
yarn watch
```

Builds continuously in development mode.

```bash
yarn test
```

Runs unit tests with Karma.

```bash
yarn lint
```

Runs the configured lint command.

## Project Structure

```text
src/app/
|-- core/                 # App configuration and theme entry points
|-- features/             # Portfolio pages and feature routes
|   |-- about/
|   |-- contact/
|   |-- home/
|   |-- portfolio/
|   `-- projects/
`-- shared/               # Shared components, constants, and models

public/
`-- assets/images/        # Static image assets
```

## Deployment

### Netlify

The repository includes `netlify.toml`. Netlify runs:

```bash
yarn build:prod
```

The production output is published from `dist/portfolio/browser` and served under `/portfolio`.

### Docker

Build and run the container with Docker Compose:

```bash
docker compose up --build
```

The container serves the built app through Nginx on host port `4200`.

## Domain

The custom domain is configured in `CNAME`:

```text
portfolio.amit-jangid.in
```
