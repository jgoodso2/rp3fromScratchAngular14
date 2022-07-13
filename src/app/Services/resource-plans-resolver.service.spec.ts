import { TestBed } from '@angular/core/testing';

import { ResourcePlansResolverService } from './resource-plans-resolver.service';

describe('ResourcePlansResolverService', () => {
  let service: ResourcePlansResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcePlansResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
