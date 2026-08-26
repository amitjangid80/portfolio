import { Component, signal } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent } from '../../shared/icon/icon.component';
import { profile } from '../../data/site';

interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

const socials: SocialLink[] = [
  { icon: 'code', label: 'GitHub', href: profile.github },
  { icon: 'work', label: 'LinkedIn', href: profile.linkedin },
  { icon: 'alternate_email', label: 'Email', href: `mailto:${profile.email}` },
];

const subjectOptions = ['Project Inquiry', 'Contract Opportunity', 'General Transmission'];

@Component({
  selector: 'app-contact',
  imports: [RevealDirective, IconComponent],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  protected readonly socials = socials;
  protected readonly subjectOptions = subjectOptions;

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly subject = signal(subjectOptions[0]);
  protected readonly message = signal('');

  protected handleSubmit(event: Event): void {
    event.preventDefault();
    const body = encodeURIComponent(`${this.message()}\n\n— ${this.name()} (${this.email()})`);
    const subject = encodeURIComponent(this.subject());
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  }
}
