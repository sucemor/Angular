import { Component, OnInit } from '@angular/core';
import { BuscadorComponent } from '../buscador/buscador.component';
import { LoginComponent } from '../login/login.component';
import { CompartidoService } from '../servicios/compartido.service';
import contactos from '../../assets/contactos.json';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { cpSync } from 'fs';
import { constants } from 'buffer';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    BuscadorComponent,
    LoginComponent,
    MatTooltipModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent {
  // Declaración de variables--------------------------------------------------------------
  // Control de errores
  mensajeError = "";
  formularioAcierto = false;
  formularioError = false;
  conexion = false;
  //Otros
  todoCargadoContactos = false;
  ARclientes: any[] = [];
  ARcontactos: any[] = []; // Declare una variable para almacenar los datos JSON
  clientesNombres: any[] = [];
  tamano = contactos.length;
  user: string = "";
  formulario: FormGroup;
  editForm: FormGroup;
  idContactoEditar = 0;
  //Mostrar formulario
  estadoFormulario: boolean = false;
  estadoFormularioEditar: boolean = false;

  // Constructor--------------------------------------------------------------------------
  constructor(private compartido: CompartidoService,
    private fb: FormBuilder) {

    this.formulario = this.fb.group({
      nombre: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$')]],
      apellidos: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$')]],
      email: ['', [Validators.required, Validators.email]],
      telefono1: [
        '',
        [
          Validators.minLength(9),
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(9),
        ],
      ],
      telefono2: [
        '',
        [
          Validators.minLength(9),
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(9),
        ],
      ],
      cliente_id: ['', Validators.required],
      observaciones: ['']
    });

    this.editForm = this.fb.group({
      nombre: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$')]],
      apellidos: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$')]],
      email: ['', [Validators.required, Validators.email]],
      telefono1: [
        '',
        [
          Validators.minLength(9),
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(9),
        ],
      ],
      telefono2: [
        '',
        [
          Validators.minLength(9),
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(9),
        ],
      ],
      observaciones: [''],
      cliente_id: ['', Validators.required],
    });
  }

  // Al iniciar--------------------------------------------------------------------------
  ngOnInit(): void {
    // Le da la información al buscador de quién lo esta usando
    this.compartido.setParentName('contactos');
    //--------------------------------------------------------
    this.compartido.datosContactos$.subscribe(datos => {
      this.ARcontactos = datos;
      if (this.ARcontactos[0] === false) {
        this.conexion = true;
      } else {
        this.tamano = this.ARcontactos.length;
      }

      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // Ahora necesito el nombre de los clientes, para ello uso la función y recogo el array de cada cliente
      // según el id
      this.clientesNombres = []; // Reseteo por si vuelve a cargar
      this.ARcontactos.forEach(element => {
        this.clientesNombres.push(this.compartido.filtrarClientesPorId(element.cliente_id));
      });

      // Ahora necesito sustituir el objeto entero por solo el nombre, que es lo que necesito
      for (let i = 0; i < this.clientesNombres.length; i++) {
        this.clientesNombres[i] = this.clientesNombres[i][0].nombre;
      }

      // Ha cargado los datos de la tabla
      this.todoCargadoContactos = true;
    });

    this.compartido.datosClientes$.subscribe(datos => {
      this.ARclientes = datos;
    });
  }

  // Código----------------------------------------------------------------------

  /**
   * Función encargada de enviar un post a la base de dato.
   * Es decir, crea un contacto con los datos del formulario
   */
  onSubmit() {
    // Reseteo las varaibles de error, por si el usuario vuelve a cometer otro error de manera seguida
    this.formularioAcierto = false;
    this.formularioError = false;
    this.mensajeError = "";

    // Si esta validado, hago el POST
    if (this.formulario.valid) {
      // Si el POST sale bien, recargo el array.
      this.compartido.enviarContactos(this.formulario.value).subscribe(resultado => {
        if (resultado.errors) {
          Object.keys(resultado.errors).forEach((key: string) => {
            console.log(this.mensajeError);
            switch (key) {
              case 'nombre':
                this.mensajeError += "El necesario introduccir un nombre";
                if (key.length > 1)
                  this.mensajeError += "<br>"
                break;

              case 'email':
                this.mensajeError += "El email ya está en uso";
                break;

              default:
                this.mensajeError = "Error al conectar con servidor, no se puede enviar datos desde el formulario, disculpe las molestias";
                break;
            }
            console.log(this.mensajeError);
          });
          // Mensaje de acierto se oculta
          this.formularioAcierto = false;
          // Mensaje de error se muestra
          this.formularioError = true;
        } else {
          // Mensaje de acierto se muestra
          this.formularioAcierto = true;
          // Mensaje de error se oculta
          this.formularioError = false;


          // Cierro el formulario
          this.cambiarEstadoFormulario();
          // Recogo clientes
          this.compartido.recogerContactos();
          this.compartido.recogerContactos();
          // Reseteo el formulario
          this.formulario.reset();
        }
      });
    } else {
      this.validateAllFormFields(this.formulario);
    }
  }


  // Detalles de cada contacto
  selectedContactIndex: number | null = null;
  /**
   * Función que permite saber que detalles se han clickeado para abrirlos
   * @param index 
   */
  toggleDetails(index: number): void {
    this.selectedContactIndex = this.selectedContactIndex === index ? null : index;
  }

  /**
   * Función encargada de enviar un post a la base de dato.
   * Es decir, editar un contacto con los datos del formulario
   */
  editarContacto(): void {

    // Reseteo las varaibles de error, por si el usuario vuelve a cometer otro error de manera seguida
    this.formularioAcierto = false;
    this.formularioError = false;
    this.mensajeError = "";

    this.compartido.editarContactos(this.editForm.value, this.idContactoEditar).subscribe(resultado => {
      if (resultado.errors) {
        Object.keys(resultado.errors).forEach((key: string) => {
          console.log(this.mensajeError);
          switch (key) {
            case 'nombre':
              this.mensajeError += "El necesario introduccir un nombre";
              if (key.length > 1)
                this.mensajeError += "<br>"
              break;

            case 'email':
              this.mensajeError += "El email ya está en uso";
              break;

            default:
              this.mensajeError = "Error al conectar con servidor, no se puede enviar datos desde el formulario, disculpe las molestias";
              break;
          }
          console.log(this.mensajeError);
        });
        // Mensaje de acierto se oculta
        this.formularioAcierto = false;
        // Mensaje de error se muestra
        this.formularioError = true;
      } else {
        // Mensaje de acierto se muestra
        this.formularioAcierto = true;
        // Mensaje de error se oculta
        this.formularioError = false;


        // Cierro el formulario
        this.cambiarEstadoFormularioEditar();
        // Recogo clientes
        this.compartido.recogerContactos();
        this.compartido.recogerContactos();
        // Reseteo el formulario
        this.editForm.reset();

        console.log(this.clientesNombres);
      }
    });
  }

  /**
   * Marca todos los campos del formulario como tocados para activar los mensajes de error.
   *
   * @param formGroup - El grupo de formularios a validar.
   */
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  /**
   * Función de ayuda para la directiva *ngFor de Angular que optimiza la renderización de listas.
   *
   * @param index - El índice del elemento actual en la lista.
   * @param item - El elemento actual en la lista.
   * @returns El índice del elemento.
   */
  trackByIndex(index: number, item: any): number {
    return index;
  }

  /**
   * Función encargada de mostrar u ocultar el formulario
   */
  cambiarEstadoFormulario(): void {
    this.estadoFormulario = !this.estadoFormulario;
  }

  /**
   * Función encargada de cerrar el formulario sin dar advertencia
   * @param event
   */
  cerrarFormulario(event: Event): void {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    this.cambiarEstadoFormulario(); // Llamar a la función que cambia el estado del formulario
  }

  /**
   * Función encargada de cerrar el formulario sin dar advertencia
   * @param event
   */
  cerrarFormularioEditar(event: Event): void {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    this.cambiarEstadoFormularioEditar(); // Llamar a la función que cambia el estado del formulario
  }

  /**
   * Función encargada de mostrar u ocultar el formulario
   */
  cambiarEstadoFormularioEditar(): void {
    this.estadoFormularioEditar = !this.estadoFormularioEditar;
  }

  eliminarContacto(id:number){
    this.compartido.eliminarContactos(id);
  }

  openEditModal(contacto: any): void {
    this.editForm.patchValue({
      nombre: contacto.nombre,
      apellidos: contacto.apellidos,
      email: contacto.email,
      telefono1: contacto.telefono1,
      telefono2: contacto.telefono2 ?? '',
      observaciones: contacto.observaciones,
      cliente_id: contacto.cliente_id
    });
    this.idContactoEditar = contacto.id;
  }
}
