import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private userSubject = new BehaviorSubject<string | null>(this.getUser());

  user$ = this.userSubject.asObservable();

  constructor() {
   }

  // Guardar usuario en localStorage y emitir el cambio
  saveUser(username: string): void {
    localStorage.setItem('user', username);
    this.userSubject.next(username);
  }

  // Obtener usuario de localStorage
  getUser(): string | null {
    // Verificar si el entorno actual soporta 'localStorage'
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user');
    } else {
      // Manejar el caso en que localStorage no está disponible
      console.warn('localStorage no está disponible en este entorno.');
      return "";
    }
  }

  // Borrar usuario de localStorage y emitir el cambio
  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
