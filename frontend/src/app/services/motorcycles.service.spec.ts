import { TestBed } from '@angular/core/testing';

import { MotoService } from './motorcycles.service';

describe('MotoService', () => {
  let service: MotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
