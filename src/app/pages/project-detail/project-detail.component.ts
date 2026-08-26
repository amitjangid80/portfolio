import { RouterLink } from '@angular/router';
import { projects, type Project } from '../../data/site';
import { RevealDirective } from '../../shared/reveal.directive';
import { Component, computed, input, InputSignal, Signal } from '@angular/core';

@Component({
    selector: 'app-project-detail',
    imports: [RouterLink, RevealDirective],
    templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent {
    readonly slug: InputSignal<string> = input<string>('');

    protected readonly project: Signal<Project | undefined> = computed<Project | undefined>((): Project | undefined =>
        projects.find((p: Project): boolean => p.slug === this.slug())
    );
}
