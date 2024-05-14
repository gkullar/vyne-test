import { Injectable, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { tap, switchMap, withLatestFrom, Observable } from 'rxjs';

import { PaymentsApiService } from '../api/';
import { PaginatedPaymentTransactions, PaymentTransactionsFilters } from '../models';
import { PageQueryArgs } from '@/pagination';
import { objectHasValue } from '@/utils';

export interface State {
  currentPagingParams: PageQueryArgs;
  currentFilterParams: PaymentTransactionsFilters;
  data: PaginatedPaymentTransactions;
  error: string | undefined;
  loading: boolean;
  hasFilters: boolean;
}

export const INITIAL_STATE: State = {
  currentPagingParams: { page: 0, size: 5 },
  currentFilterParams: { status: undefined, createdAtStart: undefined, createdAtEnd: undefined },
  data: {
    currentPage: 0,
    hasNext: false,
    items: [],
    numberOfPages: 0,
    pageSize: 0,
    totalNumberOfItems: 0
  },
  error: undefined,
  loading: false,
  hasFilters: false
};

@Injectable()
export class PaymentsStore extends ComponentStore<State> {
  private readonly paymentsApi = inject(PaymentsApiService);

  private readonly data$ = this.select((state) => state.data);

  private readonly loading$ = this.select((state) => state.loading);

  private readonly error$ = this.select((state) => state.error);

  private readonly currentPagingParams$ = this.select((state) => state.currentPagingParams);

  private readonly currentFilterParams$ = this.select((state) => state.currentFilterParams);

  private readonly hasFilters$ = this.select((state) => state.hasFilters);

  readonly vm$ = this.select(
    {
      data: this.data$,
      loading: this.loading$,
      error: this.error$,
      hasFilters: this.hasFilters$
    },
    { debounce: true }
  );

  private readonly setData = this.updater((state, data: PaginatedPaymentTransactions) => ({
    ...state,
    data
  }));

  private readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading
  }));

  private readonly setError = this.updater((state, error: string | undefined) => ({
    ...state,
    error
  }));

  private readonly setPagingParams = this.updater((state, pagingParams: PageQueryArgs) => ({
    ...state,
    currentPagingParams: { ...state.currentPagingParams, ...pagingParams }
  }));

  private readonly setFilterParams = this.updater((state, filters: PaymentTransactionsFilters) => ({
    ...state,
    currentFilterParams: { ...state.currentFilterParams, ...filters },
    hasFilters: objectHasValue(filters)
  }));

  readonly fetchData = this.effect(
    (
      fetchData$: Observable<{
        pagingParams?: PageQueryArgs;
        filterParams?: PaymentTransactionsFilters;
      }>
    ) =>
      fetchData$.pipe(
        tap(({ pagingParams, filterParams }) => {
          this.setLoading(true);
          this.setError(undefined);
          pagingParams && this.setPagingParams(pagingParams);
          filterParams && this.setFilterParams(filterParams);
        }),
        withLatestFrom(this.currentPagingParams$, this.currentFilterParams$),
        switchMap(([_, currentPagingParams, currentFilterParams]) =>
          this.paymentsApi.getPaginated({ ...currentPagingParams, ...currentFilterParams }).pipe(
            tapResponse(
              (data) => {
                this.setData(data);
                this.setLoading(false);
              },
              (error: Error) => {
                this.setError(error.message);
                this.setLoading(false);
              }
            )
          )
        )
      )
  );

  readonly onPageChanged = this.effect((pageEvent$: Observable<PageEvent>) =>
    pageEvent$.pipe(
      tap(({ pageIndex, pageSize }: PageEvent) =>
        this.fetchData({ pagingParams: { page: pageIndex, size: pageSize } })
      )
    )
  );

  readonly onFiltersChanged = this.effect((filters$: Observable<PaymentTransactionsFilters>) =>
    filters$.pipe(
      withLatestFrom(this.currentFilterParams$, this.currentPagingParams$),
      tap(([filters, currentFilterParams, currentPagingParams]) =>
        this.fetchData({
          filterParams: { ...currentFilterParams, ...filters },
          pagingParams: { ...currentPagingParams, page: 0 }
        })
      )
    )
  );

  readonly onClearFilters = this.effect(($) =>
    $.pipe(
      tap(() =>
        this.fetchData({
          filterParams: INITIAL_STATE.currentFilterParams,
          pagingParams: INITIAL_STATE.currentPagingParams
        })
      )
    )
  );

  constructor() {
    super(INITIAL_STATE);
  }
}
