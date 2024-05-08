import { Moment } from 'moment';

import { PaymentTransactionStatus } from './payment-transaction-status.enum';

export type PaymentTransactionsFilters = {
  createdAtStart?: Moment | null;
  createdAtEnd?: Moment | null;
  status?: PaymentTransactionStatus | null;
};
