import { TestBed } from '@angular/core/testing';

import { ResourcesModalCommunicatorService } from './resources-modal-communicator.service';

describe('ResourcesModalCommunicatorService', () => {
  let service: ResourcesModalCommunicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcesModalCommunicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
