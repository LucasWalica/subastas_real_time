import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chatlit } from './chatlit';

describe('Chatlit', () => {
  let component: Chatlit;
  let fixture: ComponentFixture<Chatlit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chatlit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chatlit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
