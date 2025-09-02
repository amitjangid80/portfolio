import { Routes } from '@angular/router';
import { Portfolio } from '../portfolio/portfolio';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '' },
    {
        path: '',
        component: Portfolio,
        loadChildren: () => import('../portfolio/common/portfolio.routes').then(p => p.default)
    }
];
