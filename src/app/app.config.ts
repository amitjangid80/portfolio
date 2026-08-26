import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withComponentInputBinding, withPreloading, PreloadAllModules, withHashLocation } from '@angular/router';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(
            routes,
            withHashLocation(),
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
            withComponentInputBinding()
        ),
        provideClientHydration()
    ]
};
