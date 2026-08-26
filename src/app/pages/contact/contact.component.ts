import { profile } from '../../data/site';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent } from '../../shared/icon/icon.component';
import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';

interface SocialLink {
    icon: string;
    label: string;
    href: string;
}

const socials: SocialLink[] = [
    { icon: 'code', label: 'GitHub', href: profile.github },
    { icon: 'work', label: 'LinkedIn', href: profile.linkedin }
];

const subjectOptions: string[] = ['Project Inquiry', 'Career Opportunity', 'Contract Opportunity', 'General Transmission'];

// Kept in sync by hand with the matching patterns in
// cloudflare/security-headers-worker.js — there's no shared module between
// the Angular app and the Worker, so both sides validate independently.
const NAME_PATTERN = /^[A-Za-z ]+$/;
const MESSAGE_PATTERN = /^[A-Za-z0-9 .,!?'\-:\r\n]+$/;
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Stripped live as the user types, before the full patterns above are
// checked on blur/submit. Name and message use the exact inverse of their
// full pattern, since any string built only from allowed characters is
// already valid — filtering IS the validation for them, nothing invalid
// can ever end up in the field. Email can't work that way: a valid
// address is built incrementally ("j", "jo", "john@exa" are all valid
// prefixes of a finished address), so typing can only strip characters
// that could never appear in ANY email — the full shape is still checked
// on blur/submit.
const NAME_TYPING_RE = /[^A-Za-z ]/g;
const EMAIL_TYPING_RE = /[^A-Za-z0-9._%+@-]/g;
const MESSAGE_TYPING_RE = /[^A-Za-z0-9 .,!?'\-:\r\n]/g;

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    imports: [RevealDirective, IconComponent],
})
export class ContactComponent {
    protected readonly socials: SocialLink[] = socials;
    protected readonly namePattern: string = NAME_PATTERN.source;
    protected readonly subjectOptions: string[] = subjectOptions;
    protected readonly emailPattern: string = EMAIL_PATTERN.source;

    protected readonly name: WritableSignal<string> = signal('');
    protected readonly email: WritableSignal<string> = signal('');
    protected readonly message: WritableSignal<string> = signal('');
    protected readonly subject: WritableSignal<string> = signal(subjectOptions[0]);
    protected readonly status: WritableSignal<string> = signal<'idle' | 'sending' | 'sent' | 'invalid' | 'error'>('idle');

    protected readonly emailTouched: WritableSignal<boolean> = signal(false);
    protected readonly emailInvalid: Signal<boolean> = computed(
        (): boolean => this.emailTouched() && this.email().length > 0 && !EMAIL_PATTERN.test(this.email())
    );

    protected onNameInput(event: Event): void {
        this.name.set(this.filterInput(event, NAME_TYPING_RE));
    }

    protected onEmailInput(event: Event): void {
        this.email.set(this.filterInput(event, EMAIL_TYPING_RE));
    }

    protected onMessageInput(event: Event): void {
        this.message.set(this.filterInput(event, MESSAGE_TYPING_RE));
    }

    // Reassigning `.value` moves the caret to the end, so a naive
    // replace-and-reassign scrambles anything typed faster than one
    // keystroke per render (the caret jumps forward while more
    // keystrokes are still landing at the old position). Count how many
    // disallowed characters sat before the caret and shift it back by
    // that many after filtering, so the caret stays put.
    private filterInput(event: Event, disallowed: RegExp): string {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        const original: string = target.value;
        const caret: number = target.selectionStart ?? original.length;
        const removedBeforeCaret: number = (original.slice(0, caret).match(disallowed) ?? []).length;
        const filtered: string = original.replace(disallowed, '');

        target.value = filtered;
        const newCaret: number = caret - removedBeforeCaret;
        target.setSelectionRange(newCaret, newCaret);

        return filtered;
    }

    protected async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();
        this.emailTouched.set(true);

        if (!NAME_PATTERN.test(this.name()) || !EMAIL_PATTERN.test(this.email()) || !MESSAGE_PATTERN.test(this.message())) {
            this.status.set('invalid');
            return;
        }

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
            this.emailTouched.set(false);
        } catch {
            this.status.set('error');
        }
    }
}
