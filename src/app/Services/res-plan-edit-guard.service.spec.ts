import { TestBed } from '@angular/core/testing';

import { ResPlanEditGuardService } from './res-plan-edit-guard.service';

describe('ResPlanEditGuardService', () => {
  let service: ResPlanEditGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResPlanEditGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
