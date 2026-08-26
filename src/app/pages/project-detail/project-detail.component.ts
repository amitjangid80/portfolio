import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/reveal.directive';
import { projects, type Project } from '../../data/site';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, RevealDirective],
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent {
  readonly slug = input<string>('');

  protected readonly project = computed<Project | undefined>(() =>
    projects.find((p) => p.slug === this.slug())
  );
}
