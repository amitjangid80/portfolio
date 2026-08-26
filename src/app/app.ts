import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './layout/nav/nav.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, FooterComponent],
  template: `
    <div class="relative min-h-screen flex flex-col bg-background text-on-background hud-tech-grid">
      <!-- Ambient light leaks + particles — "Holographic Glass OS", centralized site-wide.
           No -z utility here: z-index comes from .light-leak/the z-[2] below, exactly
           like the source Stitch screen (which never puts a z-* class on the leaks
           themselves, relying on .light-leak's own z-index: 1). -->
      <div class="fixed top-[20%] left-[10%] w-[400px] h-[400px] bg-primary light-leak animate-pulse-slow"></div>
      <div class="fixed bottom-[10%] right-[10%] w-[500px] h-[500px] bg-secondary light-leak animate-pulse-slow" style="animation-delay: 2s"></div>
      <div class="fixed top-[50%] left-[50%] w-[300px] h-[300px] bg-primary light-leak animate-pulse-slow" style="animation-delay: 1s"></div>
      <div class="fixed inset-0 pointer-events-none z-[2]">
        <div class="particle animate-particle-float" style="left: 10%; animation-duration: 15s"></div>
        <div class="particle animate-particle-float-delayed" style="left: 30%; animation-duration: 22s"></div>
        <div class="particle animate-particle-float" style="left: 50%; animation-duration: 18s"></div>
        <div class="particle animate-particle-float-delayed" style="left: 70%; animation-duration: 25s"></div>
        <div class="particle animate-particle-float" style="left: 90%; animation-duration: 20s"></div>
      </div>
      <app-nav />
      <main class="flex-grow pt-16">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class App {}
