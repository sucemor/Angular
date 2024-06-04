import { TestBed } from '@angular/core/testing';

import { ApigetService } from './apiget.service';

describe('ApigetService', () => {
  let service: ApigetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApigetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
