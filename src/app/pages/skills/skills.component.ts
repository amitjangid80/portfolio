import { Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent } from '../../shared/icon/icon.component';
import { CompetencyBarComponent } from './competency-bar/competency-bar.component';
import { skillsIntro, frontendSkills, backendServices, infraTags, infraTools, FrontendSkill, BackendService, InfraTool } from '../../data/site';

@Component({
    selector: 'app-skills',
    templateUrl: './skills.component.html',
    imports: [IconComponent, RevealDirective, CompetencyBarComponent],
})
export class SkillsComponent {
    protected readonly skillsIntro = skillsIntro;
    protected readonly infraTags: string[] = infraTags;
    protected readonly infraTools: InfraTool[] = infraTools;
    protected readonly frontendSkills: FrontendSkill[] = frontendSkills;
    protected readonly backendServices: BackendService[] = backendServices;
}
