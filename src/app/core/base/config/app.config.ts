import { routes } from '../../../features/app/app.routes';
import { provideRouter, withViewTransitions } from '@angular/router';
import { withI18nSupport, provideClientHydration } from '@angular/platform-browser';
import { ApplicationConfig, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes, withViewTransitions()),
        provideClientHydration(withI18nSupport()),
    ]
};
