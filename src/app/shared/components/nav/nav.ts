import { NavModel } from './common/nav.model';
import { TextConstants } from '../../constants/text';
import { NavConstants } from '../../constants/routes';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { signal, Component, WritableSignal } from '@angular/core';

@Component({
    selector: 'aj-nav',
    styleUrl: './nav.css',
    templateUrl: './nav.html',
    imports: [
        RouterLink,
        RouterLinkActive
    ]
})
export class Nav {
    protected readonly navList: WritableSignal<NavModel[]> = signal([]);

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
}
