import { TestBed } from '@angular/core/testing';

import { AuctionSocketService } from './auction-socket-service';

describe('AuctionSocketService', () => {
  let service: AuctionSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
