import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppScrollButtonsComponent } from './app-scroll-buttons.component';

describe('AppScrollButtonsComponent', () => {
  let component: AppScrollButtonsComponent;
  let fixture: ComponentFixture<AppScrollButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppScrollButtonsComponent]
    });
    fixture = TestBed.createComponent(AppScrollButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
