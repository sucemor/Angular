import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApigetService } from './apiget.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesCompartidoService {
  // Clientes
  private datosClientesSubject = new BehaviorSubject<any[]>([]);
  public datosClientes$ = this.datosClientesSubject.asObservable();
  // Usuarios
  private datosUsuariosSubject = new BehaviorSubject<any[]>([]);
  public datosUsuarios$ = this.datosUsuariosSubject.asObservable();
  // Contactos
  private datosContactosSubject = new BehaviorSubject<any[]>([]);
  public datosContactos$ = this.datosContactosSubject.asObservable();


  constructor(private api: ApigetService) {
    this.recogerClientes();
    this.recogerContactos();
    this.recogerUsuarios();
  }

  // Clientes
  private recogerClientes() {
    this.api.obtenerDatosApi('http://127.0.0.1:8000/api/clientes').subscribe({
      next: data => {
        this.datosClientesSubject.next(data);
      },
      error: error => {
        console.error('Error al recoger los clientes:', error);
        this.datosClientesSubject.next([]); // En caso de error, enviar un array vacío
      }
    });

    console.log(this.datosClientesSubject);
  }

  public enviarClientes(datos: any[]){
    if(this.api.agregarDatosApi('http://127.0.0.1:8000/api/clientes/agregar',datos)){
      this.recogerClientes();
      return true;
    }
    return false;
  }

  public actualizardatosClientes(datos: any[]) {
    this.datosClientesSubject.next(datos);
  }

  public filtrarClientesPorId(id: number) {
    let devolver = this.datosClientesSubject.getValue().filter(elemento => elemento.id === id);
    return devolver;
  }

  // Contactos
  private recogerContactos() {
    this.api.obtenerDatosApi('http://127.0.0.1:8000/api/contactos').subscribe({
      next: data => {
        this.datosContactosSubject.next(data);
      },
      error: error => {
        console.error('Error al recoger los contactos:', error);
        this.datosContactosSubject.next([]); // En caso de error, enviar un array vacío
      }
    });
  }

  public enviarContactos(datos: any[]){
    if(this.api.agregarDatosApi('http://127.0.0.1:8000/api/contactos/agregar',datos)){
      this.recogerContactos();
      return true;
    }
    return false;
  }

  public actualizardatosContactos(datos: any[]) {
    this.datosContactosSubject.next(datos);
  }

  public filtrarContactosPorId(id: number) {
    let devolver = this.datosContactosSubject.getValue().filter(elemento => elemento.id === id);
    return devolver;
  }

  // Usuarios
  private recogerUsuarios() {
    this.api.obtenerDatosApi('http://127.0.0.1:8000/api/usuarios').subscribe({
      next: data => {
        this.datosUsuariosSubject.next(data);
      },
      error: error => {
        console.error('Error al recoger los usuarios:', error);
        this.datosUsuariosSubject.next([]); // En caso de error, enviar un array vacío
      }
    });
  }

  public filtrarUsuariosPorId(id: number) {
    let devolver = this.datosUsuariosSubject.getValue().filter(elemento => elemento.id === id);
    return devolver;
  }
}