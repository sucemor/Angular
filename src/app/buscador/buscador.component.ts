import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientesCompartidoService } from '../servicios/compartido.service';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// DEBOUNCE
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss'
})
export class BuscadorComponent {
  // Declaración de variables--------------------------------------------------------------
  ARclientes: any[] = [];

  // ¿Con cual propiedad se desea filtrar?
  // Lista de propiedades
  listaClientes: string[] = [];

  // El valor por defecto del select será siempre el primer valor
  atributo = 'nada';

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

    // Subscripción a un observable para datos compartidos
    this.clientesCompartido.datosClientes$.subscribe(datos => {
      this.ARclientes = datos;

      // Recogo los atributos
      if (this.ARclientes.length > 0) {
        for (const i in this.ARclientes[0]) {
          if (this.ARclientes[0].hasOwnProperty(i)) {
            this.listaClientes.push(i);
          }
        }
      }
    });
  }

  // Función de arranque
  ngOnInit(): void {
    // Subscripción a un observable para datos compartidos
    this.clientesCompartido.datosClientes$.subscribe(datos => {
      this.ARclientes = datos;

      // Recogo los atributos
      if (this.ARclientes.length > 0) {
        this.listaClientes = [];
        for (const i in this.ARclientes[0]) {
          if (this.ARclientes[0].hasOwnProperty(i)) {
            this.listaClientes.push(i);
          }
        }
      }
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
    terminoBusqueda = terminoBusqueda.toLocaleLowerCase();
    if (!terminoBusqueda) {
      console.log(terminoBusqueda);
      this.clientesCompartido.datosClientes$.subscribe(datos => {
        this.ARclientes = datos;
      });
    }else{
      this.ARclientes = this.ARclientes.filter(elemento => {
        if(elemento[this.atributo].toLocaleLowerCase() === terminoBusqueda){
          console.log("Verdadera");
          return elemento;
        }
      });
    }
    console.log(this.ARclientes);
    // Guardo los datos en el servicio
    this.clientesCompartido.actualizardatosClientes(this.ARclientes);
  }//Acaba la función buscar

  /**
   * Función que actua cuando el botón es pulsado.
   * Utiliza la misma función de buscar que cuando se escribe solo que se le pasa de manera manual el dato.
   */
  buscarBoton() {
    this.buscar(this.busquedaControl.value);
  }
}
