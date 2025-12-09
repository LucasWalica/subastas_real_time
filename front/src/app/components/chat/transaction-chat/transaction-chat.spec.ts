import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionChat } from './transaction-chat';

describe('TransactionChat', () => {
  let component: TransactionChat;
  let fixture: ComponentFixture<TransactionChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
