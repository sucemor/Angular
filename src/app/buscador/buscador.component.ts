import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import clientes from '../../assets/clientes.json';
import { ClientesCompartidoService } from '../clientes-compartido.service';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// DEBOUNCE
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule ],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss'
})
export class BuscadorComponent {
  // Declaración de variables--------------------------------------------------------------
  ARtemporal: any[] = [];

  // ¿Con cual propiedad se desea filtrar?
  // Lista de propiedades
  listaClientes: string[] = ["Nombre", "Ciudad", "Dirección", "Correo", "Estado", "fechaCreacion"];

  // El valor por defecto del select será siempre el primer valor
  selectedCliente = this.listaClientes[0];

  // Almacena la busquedad del usuario, además recoge el valor automaticamente
  // Y permite añadir un debounce
  busquedaControl = new FormControl();

  // Constructor--------------------------------------------------------------------------
  constructor(private clientesCompartido: ClientesCompartidoService) {
    this.busquedaControl.valueChanges.pipe(
      debounceTime(1000)  // 1 segundo de espera después de la última entrada del usuario
    ).subscribe(value => {
      this.buscar(value);
    });
  }

  // No se necesita el onInit, debido a que no me interesa trabajar con los datos que haya en clientesCompartido, si no pasarle datos

  // Código----------------------------------------------------------------------
  // Envento para recoger el dato escrito
  /**
   * Función encargada de filtrar los datos a partir del termido dado
   */
  buscar(terminoBusqueda: string) {
    // Elimino las mayusculas
    terminoBusqueda =  terminoBusqueda.toLocaleLowerCase();
    // Mostrar alerta con el término de búsqueda
    switch (this.selectedCliente) {
      case this.listaClientes[0]:
        this.ARtemporal = clientes.filter(elemento => elemento.Nombre.toLowerCase().includes(terminoBusqueda));
        break;

      case this.listaClientes[1]:
        this.ARtemporal = clientes.filter(elemento => elemento.Ciudad.toLowerCase().includes(terminoBusqueda));
        break;

      case this.listaClientes[2]:
        this.ARtemporal = clientes.filter(elemento => elemento.Direccion.toLowerCase().includes(terminoBusqueda));
        break;

      case this.listaClientes[3]:
        this.ARtemporal = clientes.filter(elemento => elemento.Correo.toLowerCase().includes(terminoBusqueda));
        break;

      case this.listaClientes[4]:
        this.ARtemporal = clientes.filter(elemento => elemento.Estado.toLowerCase().includes(terminoBusqueda));
        break;

      case this.listaClientes[5]:
        this.ARtemporal = clientes.filter(elemento => elemento.fechaCreacion.toLowerCase().includes(terminoBusqueda));
        break;


      default:
        this.ARtemporal = clientes.filter(elemento => elemento.Nombre.toLowerCase().includes(terminoBusqueda));
        break;
    }//Acaba el switch
    // this.terminoBusqueda = terminoBusqueda;
    console.log(this.ARtemporal);
    // Guardo los datos en el servicioº
    this.clientesCompartido.actualizarDatosCompartidos(this.ARtemporal);
  }//Acaba la función buscar

  /**
   * Función que actua cuando el botón es pulsado.
   * Utiliza la misma función de buscar que cuando se escribe solo que se le pasa de manera manual el dato.
   */
  buscarBoton() {
    this.buscar(this.busquedaControl.value);
  }
}
