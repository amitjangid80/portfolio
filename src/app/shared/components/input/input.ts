import { Component, input, InputSignal, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'aj-input',
    templateUrl: './input.html',
    encapsulation: ViewEncapsulation.None,
})
export class Input {
    public readonly id: InputSignal<string> = input.required();
    public readonly name: InputSignal<string> = input.required();
    public readonly label: InputSignal<string> = input.required();
    public readonly inputType: InputSignal<string> = input.required();
}
