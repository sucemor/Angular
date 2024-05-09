import { Component } from '@angular/core';
import { BuscadorContactosComponent } from '../buscador-contactos/buscador-contactos.component';
import { LoginComponent } from '../login/login.component';
import { ContactosCompartidoService } from '../contactos-compartido.service';
import contactos from '../../assets/contactos.json';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [BuscadorContactosComponent, LoginComponent, MatTooltipModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss'
})
export class ContactoComponent {
  // Declaración de variables--------------------------------------------------------------
  ARcontactos: any[] = contactos; // Declare una variable para almacenar los datos JSON
  tamano = contactos.length;
  user : string = "";
  //Mostrar formulario
  estadoFormulario: boolean = false;

  // Constructor--------------------------------------------------------------------------
  constructor(private contactosCompartido: ContactosCompartidoService) {
  }

  // Al iniciar--------------------------------------------------------------------------
  ngOnInit(): void {
    this.contactosCompartido.datosCompartidos$.subscribe(datos => {
      this.ARcontactos = datos;
      this.tamano = this.ARcontactos.length;
    });
  }

  // Código----------------------------------------------------------------------
  cambiarEstadoFormulario(): void {
    if(this.estadoFormulario === false)
      this.estadoFormulario = true;
    else
      this.estadoFormulario = false;
  }
}
