import { inject } from '@vercel/analytics';
import { RouterOutlet } from '@angular/router';
import { TextConstants } from '../../shared/constants/text';
import { signal, Component, WritableSignal } from '@angular/core';

@Component({
    selector: 'aj-root',
    imports: [RouterOutlet],
    template: '<router-outlet></router-outlet>'
})
export class App {
    protected readonly title: WritableSignal<string> = signal(TextConstants.appTitle);

    constructor () {
        inject();
    }
}
