import { Routes } from '@angular/router';
import { HomeComponents } from './componentes/home-components/home-components';
import { PersonajesComponent } from './componentes/personajes-component/personajes-component';
import { PersonajeDetallesComponent } from './componentes/personaje-detalles-component/personaje-detalles-component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponents },
  { path: 'personajes', component: PersonajesComponent },
  { path: 'personajes/:id', component: PersonajeDetallesComponent }
];
