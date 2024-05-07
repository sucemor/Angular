import { Component } from '@angular/core';
import { BuscadorContactosComponent } from '../buscador-contactos/buscador-contactos.component';
import { LoginComponent } from '../login/login.component';
import { ContactosCompartidoService } from '../contactos-compartido.service';
import contactos from '../../assets/contactos.json';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [BuscadorContactosComponent, LoginComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss'
})
export class ContactoComponent {
  ARcontactos: any[] = contactos; // Declare una variable para almacenar los datos JSON
  tamano = contactos.length;
  user = "";

  constructor(private contactosCompartido: ContactosCompartidoService) {
  }

  ngOnInit(): void {
    this.contactosCompartido.datosCompartidos$.subscribe(datos => {
      this.ARcontactos = datos;
      console.log(this.ARcontactos);
      this.tamano = this.ARcontactos.length;
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
