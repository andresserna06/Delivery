import { TestBed } from '@angular/core/testing';

import { TheaterService } from './theaters.service';

describe('TheatersService', () => {
  let service: TheaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
