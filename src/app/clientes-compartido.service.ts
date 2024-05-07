import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import clientes from '../assets/clientes.json';

@Injectable({
  providedIn: 'root'
})
export class ClientesCompartidoService {
  private datosCompartidosSubject = new BehaviorSubject<any[]>([]);
  public datosCompartidos$ = this.datosCompartidosSubject.asObservable();

  constructor() { 
    this.datosCompartidosSubject.next(clientes);
  }

  public actualizarDatosCompartidos(datos: any[]) {
    this.datosCompartidosSubject.next(datos);
  }
}