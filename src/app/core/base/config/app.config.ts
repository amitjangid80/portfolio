import { routes } from '../../../features/app/app.routes';
import { withI18nSupport, provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { ApplicationConfig, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes, withViewTransitions(), withHashLocation()),
        provideClientHydration(withI18nSupport()),
    ]
};
