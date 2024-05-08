import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { ContactoComponent } from './contacto/contacto.component';
import { DetallesClienteComponent } from './detalles-cliente/detalles-cliente.component';

export const routes: Routes = [
    {path: '', component: ClientesComponent},
    {path: 'clientes', component: ClientesComponent},
    {path: 'contactos', component: ContactoComponent},
    { path: 'clientes/:id', component: DetallesClienteComponent },
    {path: '**', redirectTo:'', pathMatch: 'full'}
];
