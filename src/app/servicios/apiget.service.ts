import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApigetService {
  // Al iniciar el componente
  constructor() {}

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

  public agregarDatosApi(url: string, datos: any): Observable<boolean> {
    return from(
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
      .then(async response => {
        if (response.ok) {
          console.log('Creado exitosamente');
          return true;
        } else {
          const errorData = await response.json();
          console.error('Error al crear', errorData);
          return false;
        }
      })
      .catch(error => {
        console.error('Error general al crear', error);
        return false;
      })
    );
  }


}
