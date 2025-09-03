import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from '../../shared/components/nav/nav';

@Component({
    selector: 'aj-portfolio',
    styleUrl: './portfolio.css',
    templateUrl: './portfolio.html',
    imports: [
        RouterOutlet,

        Nav,
    ]
})
export class Portfolio {

}
