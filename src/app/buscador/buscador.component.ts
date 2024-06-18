import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompartidoService } from '../servicios/compartido.service';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// DEBOUNCE
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss',
})
export class BuscadorComponent {
  // Declaración de variables--------------------------------------------------------------
  parentName: string = "";
  todoCargado = false;
  ARDatos: any[] = [];
  // ¿Con cual propiedad se desea filtrar?
  // Lista de propiedades
  listaAtributos: any[] = [];

  // El valor por defecto del select será siempre el primer valor
  atributo = "";

  // Almacena la busquedad del usuario, además recoge el valor automaticamente
  // Y permite añadir un debounce
  busquedaControl = new FormControl();

  // Constructor--------------------------------------------------------------------------
  constructor(private Compartido: CompartidoService) {
    this.busquedaControl.valueChanges
      .pipe(
        debounceTime(1000) // 1 segundo de espera después de la última entrada del usuario
      )
      .subscribe((value) => {
        this.buscar(value);
      });
  }

  // Función de arranque
  ngOnInit(): void {
    // Averigua que padre lo está utilizando
    this.parentName = this.Compartido.getParentName();

    // Subscripción a un observable para datos compartidos
    this.Compartido.recogerAtributos(this.parentName); // Hay que hacerlo de manera manual


    this.Compartido.datosAtributos$.subscribe((datos) => {
      this.listaAtributos = datos.map(objeto => objeto.sobrenombre !== null ? objeto.sobrenombre : objeto.atributo);
      this.atributo = this.listaAtributos[0];
      // Ha cargado todo
      this.todoCargado = true;
    });

    // Según el padre donde se esté usando el buscador, se deberá suscribirse a uno u otro
    switch (this.parentName) {
      case "clientes":
        this.Compartido.datosClientes$.subscribe((datos) => {
          this.ARDatos = datos;
        });
        break;
      case "contactos":
        this.Compartido.datosContactos$.subscribe((datos) => {
          this.ARDatos = datos;
        });
        break;
      default:
        break;
    }
  }

  // No se necesita el onInit, debido a que no me interesa trabajar con los datos que haya en clientesCompartido, si no pasarle datos

  // Código----------------------------------------------------------------------
  // Envento para recoger el dato escrito
  /**
   * Función encargada de filtrar los datos a partir del termido dado
   */
  buscar(terminoBusqueda: string) {
    // Si hay término de busquedad
    if (terminoBusqueda) {
      // Filtrar los objetos según el término de búsqueda
      this.ARDatos = this.ARDatos.filter((elemento) => {
        if (elemento[this.atributo] && (elemento[this.atributo].toLocaleLowerCase() + "").includes(terminoBusqueda.toLocaleLowerCase())) {
          return true;
        }
        return false;
      });

      // Ahora necesito actualizar el array para que se muestre adecuadamente
      switch (this.parentName) {
        case "clientes":
          // Guardo los cambios en los datos en el servicio
          this.Compartido.actualizardatosClientes(this.ARDatos);
          break;
        case "contactos":
          // Guardo los cambios en los datos en el servicio
          this.Compartido.actualizardatosContactos(this.ARDatos);
          break;
        default:
          break;
      }
    } else {
      this.actualizarArray();
    }
  } //Acaba la función buscar

  /**
   * Función que dependiendo si está en clientes o en contactos, vuelve a recoger los datos desde la api
   */
  private actualizarArray(){
    switch (this.parentName) {
      case "clientes":
        this.Compartido.recogerClientes();
        break;
      case "contactos":
        this.Compartido.recogerContactos();
        break;
      default:
        break;
    }
  }
  
  /**
   * Función que actua cuando el botón es pulsado.
   * Utiliza la misma función de buscar que cuando se escribe solo que se le pasa de manera manual el dato.
   */
  buscarBoton() {
    this.buscar(this.busquedaControl.value);
  }
}
