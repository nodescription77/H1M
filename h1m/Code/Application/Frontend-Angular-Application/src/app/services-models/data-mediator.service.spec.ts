import { TestBed } from '@angular/core/testing';

import { DataMediatorService } from './data-mediator.service';

describe('DataMediatorService', () => {
  let service: DataMediatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataMediatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
