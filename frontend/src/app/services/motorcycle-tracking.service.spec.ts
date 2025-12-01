import { TestBed } from '@angular/core/testing';

import { MotorcycleTrackingService } from './motorcycle-tracking.service';

describe('MotorcycleTrackingService', () => {
  let service: MotorcycleTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotorcycleTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
