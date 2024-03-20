import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'sign-up', component: SignUpComponent}
];
