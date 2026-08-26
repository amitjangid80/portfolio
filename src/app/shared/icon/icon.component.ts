import { Component, input, InputSignal } from '@angular/core';

@Component({
    selector: 'app-icon',
    host: { style: 'display: contents;' },
    template: `
    <span
      class="material-symbols-outlined"
      [class]="extraClass()"
      [style.font-size.px]="size()"
    >{{ name() }}</span>
  `,
})
export class IconComponent {
    readonly name: InputSignal<string> = input.required<string>();
    readonly size: InputSignal<number> = input<number>(20);
    readonly extraClass: InputSignal<string> = input<string>('');
}
