import { profile } from '../../data/site';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent } from '../../shared/icon/icon.component';
import { Component, signal, WritableSignal } from '@angular/core';

interface SocialLink {
    icon: string;
    label: string;
    href: string;
}

const socials: SocialLink[] = [
    { icon: 'code', label: 'GitHub', href: profile.github },
    { icon: 'work', label: 'LinkedIn', href: profile.linkedin },
    { icon: 'alternate_email', label: 'Email', href: `mailto:${ profile.email }` },
];

const subjectOptions: string[] = ['Project Inquiry', 'Contract Opportunity', 'General Transmission'];

@Component({
    selector: 'app-contact',
    imports: [RevealDirective, IconComponent],
    templateUrl: './contact.component.html',
})
export class ContactComponent {
    protected readonly socials: SocialLink[] = socials;
    protected readonly subjectOptions: string[] = subjectOptions;

    protected readonly name: WritableSignal<string> = signal('');
    protected readonly email: WritableSignal<string> = signal('');
    protected readonly subject: WritableSignal<string> = signal(subjectOptions[0]);
    protected readonly message: WritableSignal<string> = signal('');
    protected readonly status: WritableSignal<string> = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');

    protected async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();
        this.status.set('sending');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: this.name(),
                    email: this.email(),
                    subject: this.subject(),
                    message: this.message(),
                }),
            });

            if (!response.ok) {
                throw new Error('Request failed');
            }

            this.status.set('sent');
            this.name.set('');
            this.email.set('');
            this.subject.set(subjectOptions[0]);
            this.message.set('');
        } catch {
            this.status.set('error');
        }
    }
}
