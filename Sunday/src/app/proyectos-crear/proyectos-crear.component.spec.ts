import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosCrearComponent } from './proyectos-crear.component';

describe('ProyectosCrearComponent', () => {
  let component: ProyectosCrearComponent;
  let fixture: ComponentFixture<ProyectosCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
