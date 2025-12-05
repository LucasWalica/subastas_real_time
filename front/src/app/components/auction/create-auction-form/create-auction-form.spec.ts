import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAuctionForm } from './create-auction-form';

describe('CreateAuctionForm', () => {
  let component: CreateAuctionForm;
  let fixture: ComponentFixture<CreateAuctionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAuctionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAuctionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
