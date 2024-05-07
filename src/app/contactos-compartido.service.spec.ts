import { TestBed } from '@angular/core/testing';

import { ContactosCompartidoService } from './contactos-compartido.service';

describe('ContactosCompartidoService', () => {
  let service: ContactosCompartidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactosCompartidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
