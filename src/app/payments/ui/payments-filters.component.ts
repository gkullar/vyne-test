import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import { PaymentTransactionStatus, PaymentTransactionsFilters } from '../models';
import { objectHasValue } from '@/utils';

const DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    KeyValuePipe,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic', hideRequiredMarker: true }
    },
    provideMomentDateAdapter(DATE_FORMAT)
  ],
  selector: 'app-payments-filters',
  standalone: true,
  templateUrl: './payments-filters.component.html',
  styleUrl: './payments-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsFiltersComponent {
  @Input() hasFilters: boolean;

  readonly submitFilters = output<PaymentTransactionsFilters>();

  readonly clearFilters = output();

  readonly statuses = PaymentTransactionStatus;

  readonly form = this.fb.group({
    status: this.fb.control<PaymentTransactionsFilters['status']>(null),
    createdAtStart: this.fb.control<PaymentTransactionsFilters['createdAtStart']>(null),
    createdAtEnd: this.fb.control<PaymentTransactionsFilters['createdAtEnd']>(null)
  });

  readonly filtersTrigger$ = this.form.valueChanges.pipe(
    distinctUntilChanged(),
    debounceTime(100),
    filter((formValue) => objectHasValue(formValue)),
    tap((formValue) => this.form.valid && this.submitFilters.emit(formValue))
  );

  constructor(private fb: FormBuilder) {}

  onClearFilters() {
    this.form.reset({});

    this.clearFilters.emit();
  }
}
