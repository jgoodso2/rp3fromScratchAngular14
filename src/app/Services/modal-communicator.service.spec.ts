import { TestBed } from '@angular/core/testing';

import { ModalCommunicatorService } from './modal-communicator.service';

describe('ModalCommunicatorService', () => {
  let service: ModalCommunicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalCommunicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
