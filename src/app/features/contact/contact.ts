import { Component } from '@angular/core';
import { Input } from '../../shared/components/input/input';
import { Textarea } from "../../shared/components/textarea/textarea";

@Component({
    selector: 'aj-contact',
    styleUrl: './contact.css',
    templateUrl: './contact.html',
    imports: [
        Input,
        Textarea
    ]
})
export class Contact {
    protected onSubmit(): void {

    }
}
