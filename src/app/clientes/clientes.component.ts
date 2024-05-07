import { Component } from '@angular/core';
import { BuscadorComponent } from '../buscador/buscador.component';
import { ClientesCompartidoService } from '../clientes-compartido.service';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [BuscadorComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {
  ARclientes: any[] = []; // Declare una variable para almacenar los datos JSON
  tamano: any =  1;
  user: string | null = "";

  constructor(private clientesCompartido: ClientesCompartidoService) {
  }

  ngOnInit(): void {
    // Subscripción a un observable para datos compartidos
    this.clientesCompartido.datosCompartidos$.subscribe(datos => {
      this.ARclientes = datos;
      this.tamano = this.ARclientes.length;
    });
  }


  //Mostrar formulario
  estadoFormulario: boolean = false;

  cambiarEstadoFormulario(): void {
    if(this.estadoFormulario === false)
      this.estadoFormulario = true;
    else
      this.estadoFormulario = false;
  }
}
