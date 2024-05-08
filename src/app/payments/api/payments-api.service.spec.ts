import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { createMockWithValues } from '@testing-library/angular/jest-utils';

import { PaymentsApiService } from './payments-api.service';
import { MOCK_PAGINATED_PAYMENTS } from '../mocks';
import { PaymentTransactionStatus } from '../models';

const setup = () => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      PaymentsApiService,
      { provide: MatSnackBar, useValue: createMockWithValues(MatSnackBar, { open: jest.fn() }) }
    ]
  });

  const service = TestBed.inject(PaymentsApiService);
  const httpTestingController = TestBed.inject(HttpTestingController);
  const snackbar = TestBed.inject(MatSnackBar);

  return {
    service,
    httpTestingController,
    snackbar
  };
};

describe('PaymentsApiService', () => {
  describe('getPaginated', () => {
    it('returns data on success', (done) => {
      const { service, httpTestingController } = setup();

      service
        .getPaginated({ page: 0, size: 2, status: PaymentTransactionStatus.Created })
        .subscribe((data) => {
          expect(data).toEqual(MOCK_PAGINATED_PAYMENTS);
          done();
        });

      const req = httpTestingController.expectOne('api/payments/?page=0&size=2&status=CREATED');

      expect(req.request.method).toEqual('GET');

      req.flush(MOCK_PAGINATED_PAYMENTS);

      httpTestingController.verify();
    });

    it('shows a notification on fail', () => {
      const { service, httpTestingController, snackbar } = setup();

      service.getPaginated({ page: 0, size: 2 }).subscribe();

      const req = httpTestingController.expectOne('api/payments/?page=0&size=2');

      expect(req.request.method).toEqual('GET');

      req.flush('Error!', { status: 404, statusText: 'Not Found' });

      httpTestingController.verify();

      expect(snackbar.open).toHaveBeenCalledTimes(1);
    });
  });
});
