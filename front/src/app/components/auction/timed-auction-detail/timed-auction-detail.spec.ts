import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimedAuctionDetail } from './timed-auction-detail';

describe('TimedAuctionDetail', () => {
  let component: TimedAuctionDetail;
  let fixture: ComponentFixture<TimedAuctionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimedAuctionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimedAuctionDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
