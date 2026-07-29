import { Routes } from '@angular/router';
import { VisitFormComponent } from './visit-form/visit-form';
import { LoginComponent } from './login/login';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { Inscription } from './dashboard/inscription/inscription';
import { Navbar } from './dashboard/navbar/navbar';

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
    component: Dashboard
  },
  {
    path: 'inscriptions',
    component: Inscription
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
