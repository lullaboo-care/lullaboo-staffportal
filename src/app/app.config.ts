import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LoginService } from './i-care-service.service';
//import { HttpClient} from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, HttpHeaders, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideHttpClient(), LoginService]
};
