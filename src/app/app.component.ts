import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './Navigation/navigation.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { provideHttpClient } from '@angular/common/http';
import { LoginService } from './i-care-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,Navigation],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[]
})
export class AppComponent {
  title = 'Staff Portal';
  constructor (){}
}

