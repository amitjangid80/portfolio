import { Directive, ElementRef, Renderer2, PLATFORM_ID, inject, input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class RevealDirective implements OnInit, AfterViewInit, OnDestroy {
  readonly delay = input<number | undefined>(undefined, { alias: 'appRevealDelay' });

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private rafId?: number;

  ngOnInit(): void {
    const d = this.delay();
    if (d) {
      this.renderer.addClass(this.el.nativeElement, `reveal-delay-${d}`);
    }

    if (!isPlatformBrowser(this.platformId)) {
      // Prerendered/SSR output must not ship permanently opacity:0 content
      // to crawlers or no-JS clients — mark visible immediately on the server.
      this.renderer.addClass(this.el.nativeElement, 'is-visible');
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Defer one frame so freshly-inserted content (structural directives,
    // hydration fallback re-renders) has settled before we measure it.
    this.rafId = requestAnimationFrame(() => {
      const node = this.el.nativeElement;

      // Already on screen right now? Reveal immediately instead of relying
      // solely on the observer's first async callback — this also covers
      // elements a ratio-based threshold could never satisfy (see below).
      const rect = node.getBoundingClientRect();
      const alreadyVisible =
        rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
      if (alreadyVisible) {
        this.renderer.addClass(node, 'is-visible');
        return;
      }

      // threshold: 0, not a ratio like 0.15 — an element taller than the
      // viewport (several home-page grid blocks are) can never reach 15%
      // of its own area on screen, so a ratio threshold can never fire for
      // it. rootMargin trims the bottom 10% of the viewport so elements
      // still don't reveal the instant a sliver crosses the very edge.
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(node, 'is-visible');
            this.observer?.disconnect();
          }
        },
        { threshold: 0, rootMargin: '0px 0px -10% 0px' }
      );
      this.observer.observe(node);
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
    }
    this.observer?.disconnect();
  }
}
