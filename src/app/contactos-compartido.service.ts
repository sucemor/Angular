import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import contactos from '../assets/contactos.json';

@Injectable({
  providedIn: 'root'
})
export class ContactosCompartidoService {
  private datosCompartidosSubject = new BehaviorSubject<any[]>([]);
  public datosCompartidos$ = this.datosCompartidosSubject.asObservable();

  constructor() { 
    this.datosCompartidosSubject.next(contactos);
  }

  public actualizarDatosCompartidos(datos: any[]) {
    this.datosCompartidosSubject.next(datos);
  }
}
