import { Component, OnInit } from '@angular/core';
import { BuscadorComponent } from '../buscador/buscador.component';
import { ClientesCompartidoService } from '../servicios/compartido.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [BuscadorComponent, HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  // Variables
  ARclientes: any[] = []; // Declare una variable para almacenar los datos JSON
  ARusuarios: any[] = []; // Declare una variable para almacenar los datos JSON
  tamano: any = 1;
  user: string | null = null;
  estadoFormulario: boolean = false;
  formulario: FormGroup;
  totalAngularPackages: any[] = [];


  // Constructor
  constructor(
    private clientesCompartido: ClientesCompartidoService,
    private router: Router,
    private usuarioCompartido: UsuarioService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', Validators.email],
      telefono1: ['', [Validators.minLength(9), Validators.pattern('^[0-9]*$'), Validators.maxLength(9)]],
      telefono2: ['', [Validators.minLength(9), Validators.pattern('^[0-9]*$'), Validators.maxLength(9)]],
      tipo_empresa: [''],
      encargado: [''],
      web: [''],
      direccion: [''],
      ciudad: [''],
      provincia: [''],
      pais: [''],
      codigoPostal: ['', [Validators.minLength(5), Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
      observaciones: [''],
      estado: ['contactar', Validators.required]
    });
  }

  // Función de arranque
  ngOnInit(): void {
    // Subscripción a un observable para datos compartidos
    this.clientesCompartido.datosClientes$.subscribe(datos => {
      this.ARclientes = datos;
      this.tamano = this.ARclientes.length;
    });

    this.clientesCompartido.datosUsuarios$.subscribe(datos => {
      this.ARusuarios = datos;
      // console.log(this.ARusuarios);
    });

    this.usuarioCompartido.user$.subscribe(user => {
      this.user = user;
    });
  }

  // Código
  cambiarEstadoFormulario(): void {
    this.estadoFormulario = !this.estadoFormulario;
  }

  /**
 * Función encargada de enviar un post a la base de dato.
 * Es decir, crea un cliente con los datos del formulario
 */
  onSubmit() {
    // Si esta validado, hago el POST
    if (this.formulario.valid) {
      // Si el POST sale bien, recargo el array.
      if(this.clientesCompartido.enviarClientes(this.formulario.value)){
        this.clientesCompartido.datosClientes$.subscribe(datos => {
          this.ARclientes = datos;
          this.tamano = this.ARclientes.length;
        });
      }
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
    Object.keys(formGroup.controls).forEach(field => {
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
}
