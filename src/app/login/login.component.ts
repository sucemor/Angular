import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import usuarios from '../../assets/usuarios.json';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: string | null = null;

  formularioLogin: FormGroup;
  // usuarioActivo: boolean = false;

  constructor(private form: FormBuilder, private usuarioCompartido: UsuarioService) {
    this.formularioLogin = this.form.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      contrasena: ['', [Validators.required, Validators.maxLength(15)]]
    });
  }

  ngOnInit(): void {
    // Subscripción a usuario compartido
    this.usuarioCompartido.user$.subscribe(user => {
      this.user = user;
    });
  }

  hasErrors(controlName: string, errorType: string) {
    return this.formularioLogin.get(controlName)?.hasError(errorType) && this.formularioLogin.get(controlName)?.touched;
  }

  enviar() {
    // console.log(this.formularioLogin);
    
    // Elimino la sesion
    this.usuarioCompartido.logout();
    //Recorro el json
    usuarios.forEach(element => {
      if (element.username === this.formularioLogin.get('nombre')?.value && element.password === this.formularioLogin.get('contrasena')?.value) {
        this.usuarioCompartido.saveUser(this.formularioLogin.get('nombre')?.value);
      }
    });
  }
}
