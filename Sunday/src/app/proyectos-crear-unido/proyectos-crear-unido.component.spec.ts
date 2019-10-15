import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosCrearUnidoComponent } from './proyectos-crear-unido.component';

describe('ProyectosCrearUnidoComponent', () => {
  let component: ProyectosCrearUnidoComponent;
  let fixture: ComponentFixture<ProyectosCrearUnidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosCrearUnidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosCrearUnidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
