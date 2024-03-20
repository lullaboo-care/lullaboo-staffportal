import { TestBed } from '@angular/core/testing';

import { LoginService } from './i-care-service.service';

describe('ICareServiceService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
