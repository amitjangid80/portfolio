import { Component, input, signal, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-competency-bar',
  template: `
    <div class="flex flex-col gap-2 font-label text-sm">
      <div class="flex justify-between items-center">
        <span class="text-on-surface">{{ label() }}</span>
        <span class="text-primary">{{ percent() }}%</span>
      </div>
      <div class="h-1 bg-surface-variant rounded-full overflow-hidden">
        <div
          class="h-full bg-primary rounded-full hud-progress-glow-secondary transition-[width] duration-1000 ease-out"
          [style.width.%]="width()"
        ></div>
      </div>
    </div>
  `,
})
export class CompetencyBarComponent {
  readonly label = input.required<string>();
  readonly percent = input.required<number>();

  protected readonly width = signal(0);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.width.set(this.percent()), 300);
    });
  }
}
