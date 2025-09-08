import { Component, input, InputSignal, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'aj-textarea',
    templateUrl: './textarea.html',
    encapsulation: ViewEncapsulation.None,
})
export class Textarea {
    public readonly id: InputSignal<string> = input.required();
    public readonly name: InputSignal<string> = input.required();
    public readonly label: InputSignal<string> = input.required();
}
