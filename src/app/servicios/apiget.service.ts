import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApigetService {
  private apiUrl = "http://127.0.0.1:8000/api/";
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public token$: Observable<string | null> = this.tokenSubject.asObservable();
  private userNameSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public userName$: Observable<string | null> = this.userNameSubject.asObservable();
  // Al iniciar el componente
  constructor() { }

  // Función para obtener datos
  public obtenerDatosApi(url: string): Observable<any[]> {
    // Usando fetch para obtener datos
    return from(
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error('Error al conectarse con la base de datos');
        }
        return response.json();
      })
    );
  }

  public agregarDatosApi(url: string, datos: any): Observable<any> {
    return from(
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
        .then(response => response.json())
    );
  }

  /**
   * Actualiza datos en la API usando una solicitud HTTP PUT.
   * 
   * @param url - La URL de la API.
   * @param datos - Los datos a actualizar en la API.
   * @returns Un Observable que emite la respuesta de la API.
   */
  public actualizarDatosApi(url: string, datos: any): Observable<any> {
    return from(
      fetch(url, {
        method: 'PUT', // O 'PATCH' si solo estás actualizando una parte del recurso
        headers: {
          'Content-Type': 'application/json', // Especifica el tipo de contenido como JSON
        },
        body: JSON.stringify(datos), // Convierte los datos a una cadena JSON para enviarlos en el cuerpo de la solicitud
      })
        .then(response => {
          // Si la respuesta no es OK (status en el rango 200-299), lanza un error
          if (!response.ok) {
            throw new Error('Error en la actualización de datos');
          }
          // Devuelve la respuesta convertida a JSON
          return response.json();
        })
    );
  }

  /**
 * Elimina un contacto de la API usando fetch.
 *
 * @param url - La URL de la API para eliminar el contacto.
 * @returns Un Observable que emite la respuesta de la API.
 */
  public eliminar(url: string): Observable<any> {
    return from(
      fetch(url, {
        method: 'DELETE', // Método HTTP DELETE para eliminar el recurso
        headers: {
          'Content-Type': 'application/json', // Especifica el tipo de contenido como JSON
        },
      })
        .then(response => {
          // Verifica si la respuesta no es 'ok' (status en el rango 200-299)
          if (!response.ok) {
            throw new Error('Error al eliminar el contacto'); // Lanza un error si la eliminación falla
          }
          // Convierte la respuesta a JSON
          return response.json();
        })
    );
  }


  public cogerDatosTablas(url: string, tabla: string): Observable<any> {
    const [key, value] = tabla.split(':');
    const jsonBody = { [key]: value };

    return from(
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonBody)
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(err.message || 'Error al conectarse con la base de datos');
            });
          }
          return response.json();
        })
    ).pipe(
      catchError(error => {
        console.error('Error en cogerDatosTablas:', error);
        throw error;
      })
    );
  }

  /**
   * Iniciar sesión
   * @param name - Nombre de usuario
   * @param password - Contraseña del usuario
   * @returns Una promesa con los datos de la respuesta de la API
   */
  async login(name: string, password: string): Promise<any> {
    console.log(localStorage.getItem('authToken'));
    // Realiza una solicitud POST a la API para iniciar sesión
    const response = await fetch(`${this.apiUrl}usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });

    // Verifica si la solicitud fue exitosa
    if (!response.ok) {
      throw new Error('Error en la solicitud de inicio de sesión');
    }

    // Convierte la respuesta a JSON y guarda el token de autenticación en localStorage
    let data = await response.json();
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('name', name);

    this.tokenSubject.next(data.token);
    this.userNameSubject.next(name); // Almacena el nombre del usuario
    return data;
  }

  /**
   * Cerrar sesión
   * @returns Una promesa con los datos de la respuesta de la API
   */
  async logout(): Promise<any> {
    // Obtiene el token de autenticación almacenado en localStorage
    const token = localStorage.getItem('authToken');
    // Realiza una solicitud POST a la API para cerrar sesión
    const response = await fetch(`${this.apiUrl}usuarios/cerrarsesion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // Verifica si la solicitud fue exitosa
    if (!response.ok) {
      throw new Error('Error en la solicitud de cierre de sesión');
    }

    // Elimina el token de autenticación de localStorage
    this.quitarNombre();
    return await response.json();
  }

  public quitarNombre(){
    this.tokenSubject.next(null);
    this.userNameSubject.next(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
  }

  /**
     * Obtener el nombre del usuario como observable
     * @returns Observable con el nombre del usuario
     */
  getUserName(): Observable<string | null> {
    return this.userName$;
  }
}
