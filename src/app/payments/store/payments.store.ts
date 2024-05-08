import { Injectable, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { tap, switchMap, Observable, withLatestFrom } from 'rxjs';

import { PaymentsApiService } from '../api/';
import { PaginatedPaymentTransactions, PaymentTransactionsFilters } from '../models';
import { PageQueryArgs } from '@/pagination';

interface State {
  currentPagingParams: PageQueryArgs;
  currentFilterParams: PaymentTransactionsFilters;
  loading: boolean;
  data?: PaginatedPaymentTransactions;
  error?: string;
}

export const INITIAL_STATE: State = {
  currentPagingParams: { page: 0, size: 5 },
  currentFilterParams: {},
  loading: false,
  data: undefined,
  error: undefined
};

@Injectable()
export class PaymentsStore extends ComponentStore<State> {
  private readonly paymentsApi = inject(PaymentsApiService);

  private readonly data$ = this.select((state) => state.data);

  private readonly loading$ = this.select((state) => state.loading);

  private readonly error$ = this.select((state) => state.error);

  private readonly currentPagingParams$ = this.select((s) => s.currentPagingParams);

  private readonly currentFilterParams$ = this.select((s) => s.currentFilterParams);

  readonly hasFilters$ = this.select(this.currentFilterParams$, (filters) =>
    Object.values(filters).some((value) => !!value)
  );

  readonly vm$ = this.select(
    this.data$,
    this.loading$,
    this.error$,
    this.hasFilters$,
    (data, loading, error, hasFilters) => ({
      data,
      loading,
      error,
      hasFilters
    })
  );

  readonly fetchData = this.effect(
    (
      fetchData$: Observable<{
        pagingParams?: PageQueryArgs;
        filterParams?: PaymentTransactionsFilters;
      }>
    ) =>
      fetchData$.pipe(
        tap(({ pagingParams, filterParams }) =>
          this.setState((state) => ({
            ...state,
            loading: true,
            error: INITIAL_STATE.error,
            currentPagingParams: { ...(pagingParams || state.currentPagingParams) },
            currentFilterParams: { ...(filterParams || state.currentFilterParams) }
          }))
        ),
        withLatestFrom(this.currentPagingParams$, this.currentFilterParams$),
        switchMap(([_, currentPagingParams, currentFilterParams]) =>
          this.paymentsApi.getPaginated({ ...currentPagingParams, ...currentFilterParams }).pipe(
            tapResponse(
              (data) =>
                this.setState((state) => ({
                  ...state,
                  data,
                  loading: false
                })),
              (error: Error) =>
                this.setState((state) => ({
                  ...state,
                  error: error.message,
                  loading: false
                }))
            )
          )
        )
      )
  );

  readonly onPageChanged = this.effect((pageEvent$: Observable<PageEvent>) =>
    pageEvent$.pipe(
      tap(({ pageIndex, pageSize }: PageEvent) => {
        this.fetchData({
          pagingParams: {
            page: pageIndex,
            size: pageSize
          }
        });
      })
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

  readonly onClearFilters = this.effect((_) =>
    _.pipe(
      tap(() =>
        this.fetchData({
          pagingParams: INITIAL_STATE.currentPagingParams,
          filterParams: INITIAL_STATE.currentFilterParams
        })
      )
    )
  );

  constructor() {
    super();

    this.setState({ ...INITIAL_STATE });
  }
}
