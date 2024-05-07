import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { ClientesComponent } from './clientes/clientes.component';
import { UsuarioService } from './usuario.service';
import { LoginComponent } from './login/login.component';import { NgModule } from '@angular/core';

// import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgbModule,RouterOutlet, ClientesComponent,NgxBootstrapIconsModule, LoginComponent, RouterLinkActive, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Creo la variable usuario
  user: string | null = null;

  // Inicio el servicio usuarioCompartido en el componenten principal
  constructor(private usuarioCompartido: UsuarioService) {
  }

  // En la carga de la página quiero que me hagas
  ngOnInit(): void {
    // Subscripción a usuario compartido
    this.usuarioCompartido.user$.subscribe(user => {
      this.user = user;
    });
  }

  // Cerrar sesión
  salir(){
    this.usuarioCompartido.logout();
  }
}
