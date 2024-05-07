import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorContactosComponent } from './buscador-contactos.component';

describe('BuscadorContactosComponent', () => {
  let component: BuscadorContactosComponent;
  let fixture: ComponentFixture<BuscadorContactosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorContactosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuscadorContactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
