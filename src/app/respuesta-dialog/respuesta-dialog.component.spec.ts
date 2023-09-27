import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaDialogComponent } from './respuesta-dialog.component';

describe('RespuestaDialogComponent', () => {
  let component: RespuestaDialogComponent;
  let fixture: ComponentFixture<RespuestaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespuestaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
