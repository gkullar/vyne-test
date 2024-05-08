import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { provideComponentStore } from '@ngrx/component-store';

import { PaymentsFiltersComponent } from './payments-filters.component';
import { PaymentsListComponent } from './payments-list.component';
import { PaymentsStore } from '../store';
import { ContainerComponent } from '@/container';

@Component({
  imports: [NgIf, AsyncPipe, PaymentsFiltersComponent, PaymentsListComponent, ContainerComponent],
  providers: [provideComponentStore(PaymentsStore)],
  selector: 'app-payments-container',
  standalone: true,
  templateUrl: './payments-container.component.html',
  styleUrl: './payments-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsContainerComponent {
  readonly store = inject(PaymentsStore);

  constructor() {
    this.store.fetchData({});
  }
}
