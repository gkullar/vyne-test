import { TestBed } from '@angular/core/testing';

import { createMockWithValues } from '@testing-library/angular/jest-utils';
import { Subject, first, lastValueFrom } from 'rxjs';

import { INITIAL_STATE, PaymentsStore } from './payments.store';
import { PaymentsApiService } from '../api';
import { MOCK_PAGINATED_PAYMENTS } from '../mocks';
import { PaginatedPaymentTransactions, PaymentTransactionStatus } from '../models';

const setup = () => {
  const getPaginatedPaymentsMockSubject = new Subject<PaginatedPaymentTransactions>();

  TestBed.configureTestingModule({
    providers: [
      PaymentsStore,
      {
        provide: PaymentsApiService,
        useValue: createMockWithValues(PaymentsApiService, {
          getPaginated: () => getPaginatedPaymentsMockSubject.asObservable()
        })
      }
    ]
  });

  const store = TestBed.inject(PaymentsStore);

  return {
    store,
    getPaginatedPaymentsMockSubject
  };
};

describe('PaymentsStore', () => {
  it('returns the correct initial state', async () => {
    const { store } = setup();

    const state = await lastValueFrom(store.state$.pipe(first()));

    expect(state).toMatchObject(INITIAL_STATE);
  });

  describe('fetchData', () => {
    it('returns the correct state when invoked', async () => {
      const { store } = setup();

      store.fetchData({});

      const state = await lastValueFrom(store.state$.pipe(first()));

      expect(state).toMatchObject({
        ...INITIAL_STATE,
        loading: true
      });
    });

    it('returns the correct state when there is a success response', async () => {
      const { store, getPaginatedPaymentsMockSubject } = setup();

      store.fetchData({});

      getPaginatedPaymentsMockSubject.next(MOCK_PAGINATED_PAYMENTS);

      const state = await lastValueFrom(store.state$.pipe(first()));

      expect(state).toMatchObject({
        ...INITIAL_STATE,
        data: MOCK_PAGINATED_PAYMENTS
      });
    });

    it('returns the correct state when there is an error response', async () => {
      const { store, getPaginatedPaymentsMockSubject } = setup();

      store.fetchData({});

      getPaginatedPaymentsMockSubject.error(new Error('error message'));

      const state = await lastValueFrom(store.state$.pipe(first()));

      expect(state).toMatchObject({
        ...INITIAL_STATE,
        error: 'error message'
      });
    });
  });

  describe('onPageChanged', () => {
    it('updates the paging params correctly', async () => {
      const { store } = setup();

      store.onPageChanged({ pageIndex: 1, pageSize: 5, length: 5 });

      const state = await lastValueFrom(store.state$.pipe(first()));

      expect(state.currentPagingParams).toEqual({ page: 1, size: 5 });
    });

    it('updates the paginated data correctly', async () => {
      const { store, getPaginatedPaymentsMockSubject } = setup();

      store.onPageChanged({ pageIndex: 1, pageSize: 5, length: 5 });

      getPaginatedPaymentsMockSubject.next(MOCK_PAGINATED_PAYMENTS);

      const state = await lastValueFrom(store.state$.pipe(first()));

      expect(state.data).toEqual(MOCK_PAGINATED_PAYMENTS);
    });
  });

  describe('onFiltersChanged', () => {
    it('updates the current filters state when invoked and resets the paging params to the first page', async () => {
      const { store } = setup();

      const newFilters = { status: PaymentTransactionStatus.Created };

      store.onFiltersChanged(newFilters);

      const state = await lastValueFrom(store.state$.pipe(first()));

      expect(state.currentFilterParams).toEqual(newFilters);
      expect(state.currentPagingParams).toEqual(INITIAL_STATE.currentPagingParams);
    });

    it('updates the paginated data correctly', async () => {
      const { store, getPaginatedPaymentsMockSubject } = setup();

      store.onFiltersChanged({});

      getPaginatedPaymentsMockSubject.next(MOCK_PAGINATED_PAYMENTS);

      const state = await lastValueFrom(store.state$.pipe(first()));

      expect(state.data).toEqual(MOCK_PAGINATED_PAYMENTS);
    });
  });

  describe('onClearFilters()', () => {
    it('resets filters and resets pagination upon refetch', async () => {
      const { store } = setup();

      store.onFiltersChanged({ status: PaymentTransactionStatus.Created });

      store.onPageChanged({ pageIndex: 2, pageSize: 5, length: 5 });

      store.onClearFilters();

      const state = await lastValueFrom(store.state$.pipe(first()));

      expect(state.currentFilterParams).toEqual(INITIAL_STATE.currentFilterParams);
      expect(state.currentPagingParams).toEqual(INITIAL_STATE.currentPagingParams);
    });
  });
});
