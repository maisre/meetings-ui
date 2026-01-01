import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductMeeting } from './conduct-meeting';

describe('ConductMeeting', () => {
  let component: ConductMeeting;
  let fixture: ComponentFixture<ConductMeeting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConductMeeting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConductMeeting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
