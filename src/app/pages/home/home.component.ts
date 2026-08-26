import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { profile, homeAbout, projects, featuredProjectSlugs, heroDiagramImg, type Project, HomeAboutContent } from '../../data/site';

const featured: Project[] = featuredProjectSlugs
    .map((slug: string): Project | undefined => projects.find((p: Project): boolean => p.slug === slug))
    .filter((p: Project | undefined): p is Project => !!p);

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    imports: [RouterLink, IconComponent, RevealDirective],
})
export class HomeComponent {
    protected readonly profile = profile;
    protected readonly featured: Project[] = featured;
    protected readonly heroDiagramImg: string = heroDiagramImg;
    protected readonly homeAbout: HomeAboutContent = homeAbout;
    protected readonly roleLines: string[] = profile.role.split(' | ');
}
