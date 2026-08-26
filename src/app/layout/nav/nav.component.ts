import { nav, NavItem, profile } from '../../data/site';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { Component, signal, WritableSignal } from '@angular/core';

@Component({
    selector: 'app-nav',
    imports: [RouterLink, RouterLinkActive, IconComponent],
    template: `
    <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-primary/20 shadow-2xl">
      <div class="flex justify-between items-center h-16 px-6 md:px-8 max-w-300 mx-auto">
        <a routerLink="/" class="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-primary">
          <app-icon name="memory" extraClass="text-secondary" />
          {{ profile.brand }}
          <span class="inline-flex items-center gap-1.5 font-label text-[10px] font-normal uppercase tracking-widest text-secondary bg-secondary/10 border border-secondary/30 rounded px-2 py-1 ml-1">
            <span class="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
            Online
          </span>
        </a>

        <nav class="hidden md:flex gap-4 lg:gap-6 font-label text-xs uppercase tracking-widest">
          @for (n of nav; track n.label) {
            <a
              [routerLink]="n.to"
              routerLinkActive
              #rla="routerLinkActive"
              [class.text-primary]="rla.isActive"
              [class.border-primary]="rla.isActive"
              [routerLinkActiveOptions]="{ exact: n.to === '/' }"
              class="text-on-surface-variant hover:text-primary transition-colors duration-300 active:scale-95 pb-1 border-b border-transparent hover:border-primary/50 whitespace-nowrap"
            >@if (rla.isActive) {[ }{{ n.label }}@if (rla.isActive) { ]}</a>
          }
        </nav>

        <a routerLink="/contact" class="hidden lg:inline-flex bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-[#040812] font-label-md px-4 py-2 rounded font-mono text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 whitespace-nowrap">
          Init_Connect()
        </a>

        <button
          class="md:hidden text-on-surface"
          [attr.aria-expanded]="open()"
          aria-label="Toggle navigation"
          (click)="open.set(!open())"
        >
          <app-icon [name]="open() ? 'close' : 'menu'" />
        </button>
      </div>

      @if (open()) {
        <div class="md:hidden flex flex-col px-6 pb-4 gap-1 bg-surface border-t border-primary/20">
          @for (n of nav; track n.label) {
            <a
              [routerLink]="n.to"
              (click)="open.set(false)"
              class="py-3 border-b border-primary/10 font-label text-xs uppercase tracking-widest text-on-surface"
            >{{ n.label }}</a>
          }

          <a routerLink="/contact" class="hidden lg:inline-flex bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-[#040812] font-label-md px-4 py-2 rounded font-mono text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 whitespace-nowrap">
            Init_Connect()
          </a>
        </div>
      }
    </header>
  `,
})
export class NavComponent {
    protected readonly profile = profile;
    protected readonly nav: NavItem[] = nav;
    protected readonly open: WritableSignal<boolean> = signal(false);
}
