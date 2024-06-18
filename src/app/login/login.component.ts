import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompartidoService } from '../servicios/compartido.service';
import { ApigetService } from '../servicios/apiget.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // Variables
  user: string | null = null;
  formularioRegistro: FormGroup;
  formularioLogin: FormGroup;
  intercambiarFormulario = true;
  // Control de errores
  mensajeError = "";
  formularioAcierto = false;
  formularioError = false;
  conexion = false;

  // Constructor
  constructor(private form: FormBuilder, private compartido: CompartidoService, private api: ApigetService) {
    this.formularioRegistro = this.form.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.formularioLogin = this.form.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }


  ngOnInit(): void {
    // Subscribirse al observable para obtener el nombre del usuario
    this.api.getUserName().subscribe((name) => {
      
      this.user = name;
    });
  }

  /**
   * Función encargada de enviar un post a la base de dato.
   * Es decir, crea un cliente con los datos del formulario
   */
  enviar() {
    // Reseteo las varaibles de error, por si el usuario vuelve a cometer otro error de manera seguida
    this.formularioAcierto = false;
    this.formularioError = false;
    this.mensajeError = "";

    if (this.formularioRegistro.value.password === this.formularioRegistro.value.password_confirmation) {
      // Si esta validado, hago el POST
      if (this.formularioRegistro.valid) {
        // Si el POST sale bien, recargo el array.
        let valoresFormulario = { ...this.formularioRegistro.value, tipo: 'comercial' };
        this.compartido.enviarUsuario(valoresFormulario).subscribe(resultado => {
          if (resultado.errors) {
            Object.keys(resultado.errors).forEach((key: string) => {
              console.log(resultado.errors);
              switch (key) {
                case 'name':
                  this.mensajeError += "El nombre es requerido";
                  if (key.length > 1)
                    this.mensajeError += "<br>"
                  break;
                case 'password':
                  this.mensajeError += "Error en la contraseña, mínimo 8 caracteres";
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
            // this.cambiarEstadoFormulario();
            // Recogo clientes
            // this.clientesCompartido.recogerClientes();
            // this.clientesCompartido.recogerClientes();
            // Reseteo el formulario
            this.formularioRegistro.reset();
            this.intercalar();
          }
        });
      } else {
        this.validateAllFormFields(this.formularioRegistro);
      }
    } else {
      this.mensajeError = "Las contraseñas deben ser iguales";

      // Mensaje de acierto se oculta
      this.formularioAcierto = false;
      // Mensaje de error se muestra
      this.formularioError = true;
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
   * Función encargada de cambiar entre el formulario de iniciar sesión con el formulario de registro
   */
  intercalar() {
    this.intercambiarFormulario = !this.intercambiarFormulario;
  }

  /**
   * Función encargada de inciar sesión
   */
  async loguear() {
    if (this.formularioLogin.valid) {
      try {
        let result = await this.api.login(this.formularioLogin.value.name, this.formularioLogin.value.password);
        console.log('Inicio de sesión exitoso:', result);
        this.user = this.formularioLogin.value.name;
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    } else {
      this.validateAllFormFields(this.formularioLogin);
    }
  }

  /**
   * Función encargada de cerrar el formulario sin dar advertencia
   * @param event
   */
  cerrarFormulario(event: Event): void {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    this.intercalar(); // Llamar a la función que cambia el estado del formulario
  }
}
