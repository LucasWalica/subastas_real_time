import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAdmin } from './item-admin';

describe('ItemAdmin', () => {
  let component: ItemAdmin;
  let fixture: ComponentFixture<ItemAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
