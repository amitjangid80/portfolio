import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { projects } from '../../data/site';

@Component({
  selector: 'app-projects',
  imports: [RouterLink, IconComponent, RevealDirective],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  protected readonly projects = projects;

  protected delayFor(index: number): number {
    return Math.min(index + 1, 5);
  }
}
