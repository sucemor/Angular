import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { ClientesComponent } from './clientes/clientes.component';
import { UsuarioService } from './usuario.service';
import { LoginComponent } from './login/login.component';import { NgModule } from '@angular/core';
import { NgClass } from '@angular/common';

// import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgbModule,RouterOutlet, ClientesComponent,NgxBootstrapIconsModule, LoginComponent, RouterLinkActive, RouterOutlet, RouterLink, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Creación de variables
  user: string | null = null;
  luna: boolean = false;

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

  // Código
  cambiarColores() {
    document.documentElement.style.setProperty('--color-primario', '#aadead');
    document.documentElement.style.setProperty('--color-secundario', '#bbdead');
    document.documentElement.style.setProperty('--color-terciario', '#ccdead');
    document.documentElement.style.setProperty('--color-fondo', '#dddead');
    document.documentElement.style.setProperty('--color-negro', '#4dbce9');
    document.documentElement.style.setProperty('--color-blanco', '#d1e751');
  }

  /**
   * Cambia el color en el modo noche
   */
  modoNoche(){
    this.luna = !this.luna;
    
    // Colores del modo noche
    document.documentElement.style.setProperty('--color-primario', '#282c34');
    document.documentElement.style.setProperty('--color-secundario', '#3c4049');
    document.documentElement.style.setProperty('--color-terciario', '#50565e');
    document.documentElement.style.setProperty('--color-fondo', '#20232a');
    document.documentElement.style.setProperty('--color-negro', '#abb2bf');
    document.documentElement.style.setProperty('--color-blanco', '#ffffff');
  }

  // Cerrar sesión
  salir(){
    this.usuarioCompartido.logout();
  }
}
