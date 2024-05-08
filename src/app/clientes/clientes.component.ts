import { Component } from '@angular/core';
import { BuscadorComponent } from '../buscador/buscador.component';
import { ClientesCompartidoService } from '../clientes-compartido.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [BuscadorComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {
  // Varables
  ARclientes: any[] = []; // Declare una variable para almacenar los datos JSON
  tamano: any =  1;
  user: string | null = "";
  estadoFormulario: boolean = false;

  //Cosntructor
  constructor(private clientesCompartido: ClientesCompartidoService, private router: Router) {
  }

  // Función de arranque
  ngOnInit(): void {
    // Subscripción a un observable para datos compartidos
    this.clientesCompartido.datosCompartidos$.subscribe(datos => {
      this.ARclientes = datos;
      this.tamano = this.ARclientes.length;
    });
  }

  //Código
  cambiarEstadoFormulario(): void {
    if(this.estadoFormulario === false)
      this.estadoFormulario = true;
    else
      this.estadoFormulario = false;
  }

  /**
   * Función encargada de redireccionar a detalles según el id de un cliente
   * @param id Id del cliente a mostrar
   */
  verDetalles(id: number) {
    this.router.navigate(['/clientes', id]);
  }
}
