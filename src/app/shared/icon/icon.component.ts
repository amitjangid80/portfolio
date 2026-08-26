import { Component, input } from '@angular/core';

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
  readonly name = input.required<string>();
  readonly size = input<number>(20);
  readonly extraClass = input<string>('');
}
