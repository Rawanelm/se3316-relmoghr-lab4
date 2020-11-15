import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchdMenuComponent } from './schd-menu.component';

describe('SchdMenuComponent', () => {
  let component: SchdMenuComponent;
  let fixture: ComponentFixture<SchdMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchdMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchdMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
