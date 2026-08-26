import { Component } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent } from '../../shared/icon/icon.component';
import { about, aboutStats, experience, aboutInfraImg, projects, type Accent } from '../../data/site';

@Component({
  selector: 'app-about',
  imports: [RevealDirective, IconComponent, UpperCasePipe],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  protected readonly about = about;
  protected readonly aboutStats = aboutStats.map((s) =>
    s.label === 'Projects Shipped' ? { ...s, value: `${projects.length}` } : s
  );
  protected readonly experience = experience;
  protected readonly aboutInfraImg = aboutInfraImg;

  protected accentText(accent: Accent): string {
    return { primary: 'text-primary', secondary: 'text-secondary', tertiary: 'text-tertiary' }[accent];
  }

  protected accentFill(accent: Accent): string {
    return { primary: 'bg-primary', secondary: 'bg-secondary', tertiary: 'bg-tertiary' }[accent];
  }

  protected accentBorder(accent: Accent): string {
    return { primary: 'border-primary', secondary: 'border-secondary', tertiary: 'border-tertiary' }[accent];
  }

  protected accentGlow(accent: Accent): string {
    return {
      primary: 'shadow-[0_0_10px_var(--color-primary)]',
      secondary: 'shadow-[0_0_10px_var(--color-secondary)]',
      tertiary: 'shadow-[0_0_10px_var(--color-tertiary)]',
    }[accent];
  }

  protected accentBadge(accent: Accent): string {
    return {
      primary: 'text-primary bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(173,198,255,0.3)]',
      secondary: 'text-on-surface-variant bg-white/5 border-white/20',
      tertiary: 'text-on-surface-variant bg-white/5 border-white/20',
    }[accent];
  }
}
