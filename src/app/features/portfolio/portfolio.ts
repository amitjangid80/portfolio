import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from '../../shared/components/nav/nav';

@Component({
    selector: 'aj-portfolio',
    templateUrl: './portfolio.html',
    imports: [
        RouterOutlet,

        Nav,
    ]
})
export class Portfolio {

}
