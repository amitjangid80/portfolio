import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withInMemoryScrolling, withComponentInputBinding } from '@angular/router';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(
            routes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
            withComponentInputBinding()
        ),
        provideClientHydration()
    ]
};
