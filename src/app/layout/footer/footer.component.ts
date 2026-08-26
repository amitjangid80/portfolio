import { Component } from '@angular/core';
import { profile } from '../../data/site';

interface FooterLink {
    href: string;
    label: string;
}

const links: FooterLink[] = [
    { label: 'LinkedIn', href: profile.linkedin },
    { label: 'GitHub', href: profile.github },
];

@Component({
    selector: 'app-footer',
    template: `
    <footer class="bg-surface-container-lowest w-full py-6 border-t-2 border-primary/30">
      <div class="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 max-w-350 mx-auto gap-4">
        <div class="font-mono text-sm font-bold text-primary opacity-80 flex items-center gap-2 uppercase tracking-widest">
          <span class="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
          {{ profile.brand }}
        </div>
        <div class="flex gap-6 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          @for (l of links; track l.label) {
            <a [href]="l.href" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors border-b border-transparent hover:border-primary">[{{ l.label }}]</a>
          }
        </div>
        <div class="text-outline font-mono text-[10px] uppercase">sys.date("{{ currentYear }}").copyright({{ profile.brand }}).status("Engineered with precision.")</div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
    protected readonly profile = profile;
    protected readonly currentYear: number;
    protected readonly links: FooterLink[] = links;

    constructor () {
        this.currentYear = (new Date()).getFullYear();
    }
}
