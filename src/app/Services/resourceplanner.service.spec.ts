import { TestBed } from '@angular/core/testing';

import { ResourceplannerService } from './resourceplanner.service';

describe('ResourceplannerService', () => {
  let service: ResourceplannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceplannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
