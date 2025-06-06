import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Performance optimizations
    provideZoneChangeDetection({
      eventCoalescing: true,
      runCoalescing: true
    }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
    provideAnimations()
  ]
};
