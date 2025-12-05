import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAuction } from './search-auction';

describe('SearchAuction', () => {
  let component: SearchAuction;
  let fixture: ComponentFixture<SearchAuction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAuction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAuction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
