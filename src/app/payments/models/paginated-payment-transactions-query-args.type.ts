import { PaymentTransactionsFilters } from './payment-transactions-filters.type';
import { PageQueryArgs } from '@/pagination';

export type PaginatedPaymentTransactionsQueryArgs = PageQueryArgs & PaymentTransactionsFilters;
