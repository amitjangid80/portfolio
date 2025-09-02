import { Routes } from "@angular/router";
import { RoutesConstants } from "../../../shared/constants/routes";

export default [
    { path: '', pathMatch: 'full', redirectTo: RoutesConstants.home },
    { path: RoutesConstants.home, loadComponent: () => import('../../home/home').then(m => m.Home) },
    { path: RoutesConstants.about, loadComponent: () => import('../../about/about').then(m => m.About) },
    { path: RoutesConstants.contact, loadComponent: () => import('../../contact/contact').then(m => m.Contact) },
    { path: RoutesConstants.projects, loadComponent: () => import('../../projects/projects').then(m => m.Projects) },
] as Routes
