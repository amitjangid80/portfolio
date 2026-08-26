import { RenderMode, ServerRoute } from '@angular/ssr';
import { projects } from './data/site';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return projects.map((p) => ({ slug: p.slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
