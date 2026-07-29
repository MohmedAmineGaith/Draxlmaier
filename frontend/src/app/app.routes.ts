import { Routes } from '@angular/router';
import { VisitFormComponent } from './visit-form/visit-form';
import { LoginComponent } from './login/login';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { Inscription } from './dashboard/inscription/inscription';
import { Navbar } from './dashboard/navbar/navbar';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'visit-form',
    pathMatch: 'full'
  },
  {
    path: 'visit-form',
    component: VisitFormComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dash',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'inscriptions',
    component: Inscription,
    canActivate: [authGuard]
  },
  {
    path: 'navbar',
    component: Navbar
  },
  {
    path: '**',
    redirectTo: 'visit-form'
  }
];
