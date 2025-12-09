import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAdminPanel } from './sales-admin-panel';

describe('SalesAdminPanel', () => {
  let component: SalesAdminPanel;
  let fixture: ComponentFixture<SalesAdminPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesAdminPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesAdminPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
