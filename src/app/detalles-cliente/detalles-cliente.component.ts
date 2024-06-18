import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CompartidoService } from '../servicios/compartido.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-detalles-cliente',
  standalone: true,
  imports: [NgClass],
  templateUrl: './detalles-cliente.component.html',
  styleUrl: './detalles-cliente.component.scss',
})
export class DetallesClienteComponent {
  ARclientes: any[] = [];
  cliente: any = [];
  todoCargado = false;

  constructor(
    private route: ActivatedRoute,
    private clienteService: CompartidoService,
    private router: Router
  ) {
    this.clienteService.datosClientes$.subscribe((datos) => {
      this.ARclientes = datos;
    });

    this.route.paramMap.subscribe((params) => {
      let id = Number(params.get('id'));
      this.cliente = this.clienteService.filtrarClientesPorId(id);

      // En caso de que no recoga correctamente los datos
      if(this.cliente[0]){
        let detallesCliente = {
          idGuardar: id,
          array: this.cliente
        };
        sessionStorage.setItem("detallesCliente",JSON.stringify(detallesCliente));
      }else{
        let detallesClienteData = sessionStorage.getItem('detallesCliente');
        if (detallesClienteData) {
          let detallesCliente = JSON.parse(detallesClienteData);
          id = detallesCliente.idGuardar;
          this.cliente = detallesCliente.array;

          // No coincide el id de la ruta con el id de la sesion
          if(id+"" !== params.get('id')){
            this.router.navigate(['/clientes']);
          }
          // No hay datos en la sesión asi redirecciono
        } else {
          this.router.navigate(['/clientes']);
        }
      }
      this.cliente = this.cliente[0];
      console.log(this.cliente);
      this.todoCargado = true;
    });

  }

  /**
   * Función encargada de ponerle color según el estado del cliente
   * @param type 
   * @returns 
   */
  aplicarEstado(type: string): string {
    switch (this.cliente.estado) {
      case 'contactar':
        return type === '1' ? 'completado' : '';
      case 'intento':
        return type === '1' || type === '2' ? 'completado' : '';
        case 'posible':
          return type === '1' || type === '2' || type === '3' || type === '4' ? 'completado' : '';
      case 'acuerdo':
        return type === '1' || type === '2' || type === '3' || type === '4' ? 'completado' : '';
      case 'terminado':
        return type === '1' || type === '2' || type === '3' || type === '4' || type === '5'
          ? 'completado'
          : '';
      case 'cancelado':
        return type === '1' ||
          type === '2' ||
          type === '3' ||
          type === '4' ||
          type === '5'
          ? 'completado'
          : '';
      default:
        return '';
    }
  }
}
