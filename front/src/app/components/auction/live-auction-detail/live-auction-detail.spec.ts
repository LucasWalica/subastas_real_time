import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAuctionDetail } from './live-auction-detail';

describe('LiveAuctionDetail', () => {
  let component: LiveAuctionDetail;
  let fixture: ComponentFixture<LiveAuctionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAuctionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveAuctionDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
