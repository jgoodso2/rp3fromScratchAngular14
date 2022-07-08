import { TestBed } from '@angular/core/testing';

import { TimehseetService } from './timesheet.service.';

describe('TimehseetService', () => {
  let service: TimehseetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimehseetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
