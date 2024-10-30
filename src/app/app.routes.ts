import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SuperHeroListComponent } from './pages/super-hero-list/super-hero-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'listado', component: SuperHeroListComponent },
  { path: '**', redirectTo: '' },
];
