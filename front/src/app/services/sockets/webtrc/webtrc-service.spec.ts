import { TestBed } from '@angular/core/testing';

import { WebtrcService } from './webtrc-service';

describe('WebtrcService', () => {
  let service: WebtrcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebtrcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
