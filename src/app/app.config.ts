import { ApplicationConfig, provideZoneChangeDetection ,importProvidersFrom} from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { HttpClient, HttpClientModule } from '@angular/common/http'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withRouterConfig({ scrollPositionRestoration: 'top' })),importProvidersFrom(HttpClientModule, HttpClient)]
};
