import { TestBed } from '@angular/core/testing';

import { UserstateService } from './userState.service';

describe('UserstateService', () => {
  let service: UserstateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserstateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
