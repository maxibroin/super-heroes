import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'listado',
    loadComponent: () =>
      import('./pages/super-hero-list/super-hero-list.component').then(
        (m) => m.SuperHeroListComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
