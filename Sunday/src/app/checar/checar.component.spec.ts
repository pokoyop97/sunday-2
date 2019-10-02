import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecarComponent } from './checar.component';

describe('ChecarComponent', () => {
  let component: ChecarComponent;
  let fixture: ComponentFixture<ChecarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
