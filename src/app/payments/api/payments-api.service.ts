import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '@env/environment';
import moment from 'moment';
import { Observable, tap } from 'rxjs';

import { PaginatedPaymentTransactions, PaginatedPaymentTransactionsQueryArgs } from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentsApiService {
  private http = inject(HttpClient);

  private notification = inject(MatSnackBar);

  private readonly url = `${environment.api}/payments`;

  getPaginated({
    page,
    size,
    status,
    createdAtStart,
    createdAtEnd
  }: PaginatedPaymentTransactionsQueryArgs): Observable<PaginatedPaymentTransactions> {
    let params = new HttpParams().append('page', page.toString()).append('size', size.toString());

    if (status) {
      params = params.append('status', status);
    }

    if (createdAtStart) {
      params = params.append('createdAtStart', moment(createdAtStart).format('YYYY-MM-DD'));
    }

    if (createdAtEnd) {
      params = params.append('createdAtEnd', moment(createdAtEnd).format('YYYY-MM-DD'));
    }

    return this.http.get<PaginatedPaymentTransactions>(`${this.url}/`, { params }).pipe(
      tap({
        error: () =>
          this.notification.open('Error retrieving payment transactions', 'Close', {
            panelClass: ['error']
          })
      })
    );
  }
}
