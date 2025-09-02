import { App } from './app/features/app/app';
import { appConfig } from './app/core/base/config/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
