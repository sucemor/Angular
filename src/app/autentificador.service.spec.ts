import { TestBed } from '@angular/core/testing';

import { AutentificadorService } from './autentificador.service';

describe('AutentificadorService', () => {
  let service: AutentificadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutentificadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
