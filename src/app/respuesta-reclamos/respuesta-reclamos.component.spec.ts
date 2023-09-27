import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaReclamosComponent } from './respuesta-reclamos.component';

describe('RespuestaReclamosComponent', () => {
  let component: RespuestaReclamosComponent;
  let fixture: ComponentFixture<RespuestaReclamosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespuestaReclamosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestaReclamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
