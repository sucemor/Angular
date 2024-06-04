import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientesCompartidoService } from '../servicios/compartido.service';

@Component({
  selector: 'app-detalles-cliente',
  standalone: true,
  imports: [],
  templateUrl: './detalles-cliente.component.html',
  styleUrl: './detalles-cliente.component.scss'
})
export class DetallesClienteComponent {
  // Tienes que crear la clase cliente
  // cliente: Cliente;
  // import { Cliente } from './cliente.model';
  cliente : any = [];

  constructor(private route: ActivatedRoute, private clienteService: ClientesCompartidoService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // console.log(params.get('id'));
      const id = Number(params.get('id'));
      this.cliente = this.clienteService.filtrarClientesPorId(id);
      // console.log(this.cliente);
    });
  }
}
