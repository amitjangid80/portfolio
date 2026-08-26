import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { profile, homeAbout, projects, featuredProjectSlugs, heroDiagramImg, type Project } from '../../data/site';

const featured: Project[] = featuredProjectSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is Project => !!p);

@Component({
  selector: 'app-home',
  imports: [RouterLink, IconComponent, RevealDirective],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly profile = profile;
  protected readonly homeAbout = homeAbout;
  protected readonly heroDiagramImg = heroDiagramImg;
  protected readonly featured = featured;
  protected readonly roleLines = profile.role.split(' | ');
}
