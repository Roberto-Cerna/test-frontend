import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDialogComponent } from './registro-dialog.component';

describe('RegistroDialogComponent', () => {
  let component: RegistroDialogComponent;
  let fixture: ComponentFixture<RegistroDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
