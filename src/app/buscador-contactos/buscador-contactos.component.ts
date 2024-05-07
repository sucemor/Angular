import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import contactos from '../../assets/contactos.json';
import { ContactosCompartidoService } from '../contactos-compartido.service';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// DEBOUNCE
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-buscador-contactos',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule ],
  templateUrl: './buscador-contactos.component.html',
  styleUrl: './buscador-contactos.component.scss'
})
export class BuscadorContactosComponent {
// Recogo los datos del padre
@Input() datosParaHijo: any;

// ¿Con cual propiedad se desea filtrar?
// Lista de propiedades
listaContactos: string[] = ["Nombre", "Apellidos", "Correo", "Teléfono", "Observaciones", "cliente"];
// El valor por defecto del select será siempre el primer valor
selectedCliente = this.listaContactos[0];
// Creo la variable que almacenara la cadena escrita en el input
busquedaControl = new FormControl(); // Establecer el tiempo de búsquedad
terminoBusqueda: string = '';// Propiedad para almacenar el valor del input

constructor(private ARCompartido: ContactosCompartidoService) { 
  this.busquedaControl.valueChanges.pipe(
    debounceTime(1000)  // 1 segundo de espera después de la última entrada del usuario
  ).subscribe(value => {
    this.buscar(value);
  });
}

// Envento para recoger el dato escrito
/**
 * Función encargada de filtrar los datos a partir del termido dado
 */
buscar(terminoBusqueda: string) {
  // Elimino las mayusculas
  terminoBusqueda =  terminoBusqueda.toLocaleLowerCase();
  // Mostrar alerta con el término de búsqueda
  switch (this.selectedCliente) {
    case this.listaContactos[0]:
      this.datosParaHijo = contactos.filter(elemento => elemento.nombre.toLowerCase().includes(terminoBusqueda));
      break;

    case this.listaContactos[1]:
      this.datosParaHijo = contactos.filter(elemento => elemento.apellidos.toLowerCase().includes(terminoBusqueda));
      break;

    case this.listaContactos[2]:
      this.datosParaHijo = contactos.filter(elemento => elemento.correo.toLowerCase().includes(terminoBusqueda));
      console.log(this.datosParaHijo);
      break;

    case this.listaContactos[3]:
      this.datosParaHijo = contactos.filter(elemento => elemento.telefono.toLowerCase().includes(terminoBusqueda));
      break;

    case this.listaContactos[4]:
      this.datosParaHijo = contactos.filter(elemento => elemento.observaciones.toLowerCase().includes(terminoBusqueda));
      break;

    case this.listaContactos[5]:
      this.datosParaHijo = contactos.filter(elemento => elemento.cliente.toLowerCase().includes(terminoBusqueda));
      break;


    default:
      this.datosParaHijo = contactos.filter(elemento => elemento.nombre.toLowerCase().includes(terminoBusqueda));
      break;
  }//Acaba el switch
  this.terminoBusqueda = terminoBusqueda;
  // Guardo los datos en el servicioº
  this.ARCompartido.actualizarDatosCompartidos(this.datosParaHijo);
  console.log(this.ARCompartido);
}//Acaba la función buscar

/**
 * Función que actua cuando el botón es pulsado.
 * Utiliza la misma función de buscar que cuando se escribe solo que se le pasa de manera manual el dato.
 */
buscarBoton() {
  this.buscar(this.busquedaControl.value);
}
}
