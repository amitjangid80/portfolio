import { Component } from '@angular/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { CompetencyBarComponent } from './competency-bar/competency-bar.component';
import { skillsIntro, frontendSkills, backendServices, infraTags, infraTools } from '../../data/site';

@Component({
  selector: 'app-skills',
  imports: [IconComponent, RevealDirective, CompetencyBarComponent],
  templateUrl: './skills.component.html',
})
export class SkillsComponent {
  protected readonly skillsIntro = skillsIntro;
  protected readonly frontendSkills = frontendSkills;
  protected readonly backendServices = backendServices;
  protected readonly infraTags = infraTags;
  protected readonly infraTools = infraTools;
}
