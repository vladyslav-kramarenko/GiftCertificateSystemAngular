import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateEditComponent } from './certificate-edit.component';

describe('CertificateEditComponent', () => {
  let component: CertificateEditComponent;
  let fixture: ComponentFixture<CertificateEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificateEditComponent]
    });
    fixture = TestBed.createComponent(CertificateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
