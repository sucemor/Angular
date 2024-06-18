import { Component, OnInit } from '@angular/core';
import { BuscadorComponent } from '../buscador/buscador.component';
import { CompartidoService } from '../servicios/compartido.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    BuscadorComponent,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {
  // Declaración de variables--------------------------------------------------------------

  // Control de errores
  mensajeError = "";
  formularioAcierto = false;
  formularioError = false;
  conexion = false;

  //Otros
  todoCargadoClientes = false;
  ARclientes: any[] = []; // Declare una variable para almacenar los datos JSON
  ARusuarios: any[] = []; // Declare una variable para almacenar los datos JSON
  tamano: any = 1;
  user: string | null = null;
  estadoFormulario: boolean = false;
  formulario: FormGroup;
  totalAngularPackages: any[] = [];

  // Constructor--------------------------------------------------------------------------
  constructor(
    private clientesCompartido: CompartidoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', Validators.email],
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
      tipo_empresa: [''],
      encargado: [''],
      web: [''],
      direccion: [''],
      ciudad: [''],
      provincia: [''],
      pais: [''],
      codigoPostal: [
        '',
        [
          Validators.minLength(5),
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(5),
        ],
      ],
      observaciones: [''],
      estado: ['contactar', Validators.required],
    });
  }

  // Función de arranque
  ngOnInit(): void {
    // Le da la información al buscador de quién lo esta usando
    this.clientesCompartido.setParentName('clientes');
    //--------------------------------------------------------
    // Subscripción a un observable para datos compartidos
    this.clientesCompartido.datosClientes$.subscribe((datos) => {
      this.ARclientes = datos;
      if (this.ARclientes[0] === false) {
        this.conexion = true;
      } else {
        this.conexion = false;
        this.tamano = this.ARclientes.length;
      }

      // Ha cargado los datos de la tabla
      this.todoCargadoClientes = true;
    });

    this.clientesCompartido.datosUsuarios$.subscribe((datos) => {
      this.ARusuarios = datos;
    });
  }

  // Código
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
   * Función encargada de enviar un post a la base de dato.
   * Es decir, crea un cliente con los datos del formulario
   */
  onSubmit() {
    // Reseteo las varaibles de error, por si el usuario vuelve a cometer otro error de manera seguida
    this.formularioAcierto = false;
    this.formularioError = false;
    this.mensajeError = "";

    // Si esta validado, hago el POST
    if (this.formulario.valid) {
      // Si el POST sale bien, recargo el array.
      this.clientesCompartido.enviarClientes(this.formulario.value).subscribe(resultado => {
        if (resultado.errors) {
          Object.keys(resultado.errors).forEach((key: string) => {
            switch (key) {
              case 'nombre':
                this.mensajeError += "El nombre ya está en uso";
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
          this.clientesCompartido.recogerClientes();
          this.clientesCompartido.recogerClientes();
          // Reseteo el formulario
          this.formulario.reset();
        }
      });
    } else {
      this.validateAllFormFields(this.formulario);
    }
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
   * Función encargada de redireccionar a detalles según el id de un cliente
   * @param id Id del cliente a mostrar
   */
  verDetalles(id: number) {
    this.router.navigate(['/clientes', id]);
  }

  editar() {
    alert('Botón de editar');
  }
}
