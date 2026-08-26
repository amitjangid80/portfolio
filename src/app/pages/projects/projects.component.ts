import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, projects } from '../../data/site';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    imports: [RouterLink, IconComponent, RevealDirective],
})
export class ProjectsComponent {
    protected readonly projects: Project[] = projects;

    protected delayFor(index: number): number {
        return Math.min(index + 1, 5);
    }
}
