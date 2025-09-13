import { NavModel } from './common/nav.model';
import { TextConstants } from '../../constants/text';
import { NavConstants } from '../../constants/routes';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { signal, Signal, viewChild, Component, ElementRef, WritableSignal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'aj-nav',
    styleUrl: './nav.css',
    templateUrl: './nav.html',
    imports: [
        NgClass,
        RouterLink,
        RouterLinkActive
    ]
})
export class Nav {
    protected readonly navList: WritableSignal<NavModel[]> = signal([]);
    protected readonly showNavBar: WritableSignal<boolean> = signal(false);

    protected readonly nav: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef<HTMLElement>>("nav");

    constructor () {
        this.navList().push(
            ...[
                { icon: 'pi-home', cssClass: 'nav-home', title: TextConstants.home, route: NavConstants.home },
                { icon: 'pi-info-circle', cssClass: 'nav-about', title: TextConstants.about, route: NavConstants.about },
                { icon: 'pi-briefcase', cssClass: 'nav-projects', title: TextConstants.projects, route: NavConstants.projects },
                { icon: 'pi-envelope', cssClass: 'nav-contact', title: TextConstants.contact, route: NavConstants.contact },
            ]
        );
    }

    protected onNavClick(): void {
        this.showNavBar.update((showNavBar: boolean) => showNavBar = !showNavBar);
    }
}
