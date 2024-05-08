import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

import { PaginatedPaymentTransactions } from '../models';
import { StatusIconPipe } from '../pipes';
import { paymentTransactionStatusIcon } from '../utils';

@Component({
  imports: [
    DatePipe,
    DecimalPipe,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTableModule,
    StatusIconPipe
  ],
  selector: 'app-payments-list',
  standalone: true,
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsListComponent {
  @Input() data: PaginatedPaymentTransactions['items'];

  @Input() pageIndex: number;

  @Input() pageSize: number;

  @Input() length: number;

  @Input() isLoading: boolean;

  readonly pageChanged = output<PageEvent>();

  readonly displayedColumns = ['id', 'description', 'currency', 'amount', 'status', 'created'];

  readonly statusIcon = paymentTransactionStatusIcon;
}
