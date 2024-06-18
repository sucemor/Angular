import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApigetService } from './apiget.service';
import { constants } from 'node:buffer';

@Injectable({
  providedIn: 'root'
})
export class CompartidoService {
  // Clientes
  private datosClientesSubject = new BehaviorSubject<any[]>([]);
  public datosClientes$ = this.datosClientesSubject.asObservable();
  // Usuarios
  private datosUsuariosSubject = new BehaviorSubject<any[]>([]);
  public datosUsuarios$ = this.datosUsuariosSubject.asObservable();
  // Contactos
  private datosContactosSubject = new BehaviorSubject<any[]>([]);
  public datosContactos$ = this.datosContactosSubject.asObservable();
  // Atributos
  private datosAtributosSubject = new BehaviorSubject<any[]>([]);
  public datosAtributos$ = this.datosAtributosSubject.asObservable();


  constructor(private api: ApigetService) {
    this.recogerClientes();
    this.recogerContactos();
    this.recogerUsuarios();
  }

  // Clientes
  public recogerClientes() {
    this.api.obtenerDatosApi('http://127.0.0.1:8000/api/clientes').subscribe({
      next: data => {
        data = data.filter(item => !item.deleted_at);
        data.forEach(element => {
          element.created_at = this.formatearFecha(element.created_at);
          element.updated_at = this.formatearFecha(element.updated_at);
        });
        this.datosClientesSubject.next(data);
      },
      error: error => {
        this.datosClientesSubject.next([false]); // En caso de error, enviar un array vacío
      }
    });
  }

  /**
   * Función encargada de enviar los datos al servidor y recoger su respuesta
   * @param datos Datos del formulario
   * @returns Respuesta de angular
   */
  public enviarClientes(datos: any[]): Subject<any> {
    const resultadoSubject = new Subject<any>();
  
    this.api.agregarDatosApi('http://127.0.0.1:8000/api/clientes/agregar', datos)
      .subscribe({
        next: (resultado) => {
          resultadoSubject.next(resultado);
          resultadoSubject.complete();
        },
        error: (err) => {
          resultadoSubject.next({ errors : 'Error al conectar con el servidor' });
          resultadoSubject.complete();
        }
      });
  
    return resultadoSubject;
  }
  
  

  public actualizardatosClientes(datos: any[]) {
    this.datosClientesSubject.next(datos);
  }


  public filtrarClientesPorId(id: number) {
    this.recogerClientes();
    let devolver = this.datosClientesSubject.getValue().filter(elemento => elemento.id === id);
    return devolver;
  }

  // Atributos
  public recogerAtributos(tipo: string) {
    this.api.cogerDatosTablas('http://127.0.0.1:8000/api/atributos/tabla', ('tabla:' + tipo)).subscribe({
      next: data => {
        this.datosAtributosSubject.next(data);
      },
      error: error => {
        console.error('Error al recoger los atributos:', error);
        this.datosAtributosSubject.next([false]); // En caso de error, enviar un array vacío
      }
    });
  }

  /**
   * Los atributos de la base de datos pueden discrepar con los atributos en la tabla atributoss
   * Para eso existe esta función, la cual iguala atributos en ambos
   */
  public sincronizar() {
    this.api.obtenerDatosApi('http://127.0.0.1:8000/api/sincroniza');
  }


  public enviarAtributos(datos: any[]) {
    if (this.api.agregarDatosApi('http://127.0.0.1:8000/api/atributos/agregar', datos)) {
      return true;
    }
    return false;
  }

  public actualizardatosAtributos(datos: any[]) {
    this.datosAtributosSubject.next(datos);
  }

  public filtrarAtributosPorId(id: number, tabla: string) {
    this.recogerAtributos(tabla);
    let devolver = this.datosAtributosSubject.getValue().filter(elemento => elemento.id === id);
    return devolver;
  }

  // Contactos
  public recogerContactos() {
    this.api.obtenerDatosApi('http://127.0.0.1:8000/api/contactos').subscribe({
      next: data => {
        data = data.filter(item => !item.deleted_at);
        data.forEach(element => {
          element.created_at = this.formatearFecha(element.created_at);
          element.updated_at = this.formatearFecha(element.updated_at);
        });
        this.datosContactosSubject.next(data);
      },
      error: error => {
        console.error('Error al recoger los contactos:', error);
        this.datosContactosSubject.next([false]); // En caso de error, enviar un array vacío
      }
    });
  }

  /**
   * Función encargada de enviar los datos al servidor y recoger su respuesta
   * @param datos Datos del formulario
   * @returns Respuesta de angular
   */
  public enviarContactos(datos: any[]): Subject<any> {
    const resultadoSubject = new Subject<any>();
  
    this.api.agregarDatosApi('http://127.0.0.1:8000/api/contactos/agregar', datos)
      .subscribe({
        next: (resultado) => {
          resultadoSubject.next(resultado);
          resultadoSubject.complete();
        },
        error: (err) => {
          resultadoSubject.next({ errors : 'Error al conectar con el servidor' });
          resultadoSubject.complete();
        }
      });
  
    return resultadoSubject;
  }

  /**
   * Función encargada de enviar la petición de actualización o edición de un contacto
   * @param datos Datos a enviar
   * @param id Id del contacto a modificar
   * @returns 
   */ 
  public editarContactos(datos: any[], id: number): Subject<any> {
    const resultadoSubject = new Subject<any>();
    console.log("http://127.0.0.1:8000/api/contactos/actualizar/"+ id);
  
    this.api.actualizarDatosApi('http://127.0.0.1:8000/api/contactos/actualizar/' + id, datos)
      .subscribe({
        next: (resultado) => {
          resultadoSubject.next(resultado);
          resultadoSubject.complete();
        },
        error: (err) => {
          resultadoSubject.next({ errors : 'Error al conectar con el servidor' });
          resultadoSubject.complete();
        }
      });
  
    return resultadoSubject;
  }

  public eliminarContactos(id: number) {
    this.api.eliminar('http://127.0.0.1:8000/api/contactos/borrar/'+ id);
  }

  public actualizardatosContactos(datos: any[]) {
    this.datosContactosSubject.next(datos);
  }

  public filtrarContactosPorId(id: number) {
    this.recogerContactos();
    let devolver = this.datosContactosSubject.getValue().filter(elemento => elemento.id === id);
    return devolver;
  }

  // Usuarios
  private recogerUsuarios() {
    this.api.obtenerDatosApi('http://127.0.0.1:8000/api/usuarios').subscribe({
      next: data => {
        data = data.filter(item => !item.deleted_at);
        this.datosUsuariosSubject.next(data);
      },
      error: error => {
        console.error('Error al recoger los usuarios:', error);
        this.datosUsuariosSubject.next([false]); // En caso de error, enviar un array vacío
      }
    });
  }

  /**
   * Función encargada de enviar los datos al servidor y recoger su respuesta
   * @param datos Datos del formulario
   * @returns Respuesta de angular
   */
  public enviarUsuario(datos: any[]): Subject<any> {
    const resultadoSubject = new Subject<any>();

    console.log("Esto es una mierda");
    console.log(datos);
    this.api.agregarDatosApi('http://127.0.0.1:8000/api/usuarios/agregar', datos)
      .subscribe({
        next: (resultado) => {
          resultadoSubject.next(resultado);
          resultadoSubject.complete();
        },
        error: (err) => {
          resultadoSubject.next({ errors : 'Error al conectar con el servidor' });
          resultadoSubject.complete();
        }
      });
  
    return resultadoSubject;
  }

  public filtrarUsuariosPorId(id: number) {
    let devolver = this.datosUsuariosSubject.getValue().filter(elemento => elemento.id === id);
    return devolver;
  }

  /**
   * Función encargada de recoger la fecha de la base de datos y darle un formato más visible además
   * de sumarle dos horas más debido a que es UTC y pasa a ser fecha de Madrid
   * @param fecha 
   * @returns 
   */
  private formatearFecha(fecha: string) {
    fecha = fecha.split("T")[0].split("-")[2] + "-" + fecha.split("T")[0].split("-")[1] + "-" + fecha.split("T")[0].split("-")[0] + " || " + (Number(fecha.split("T")[1].split(".")[0].split(":")[0]) + 2) + ":" + fecha.split("T")[1].split(".")[0].split(":")[1] + ":" + fecha.split("T")[1].split(".")[0].split(":")[2];
    return fecha;
  }


  //------------------------------------------------------------------------------------------------------------------------------
  // BUSCADOR
  private parentName: string = "";

  setParentName(name: string) {
    this.parentName = name;
  }

  getParentName(): string {
    return this.parentName;
  }
}