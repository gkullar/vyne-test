import { PaymentTransaction } from './payment-transaction.interface';
import { Pagination } from '@/pagination';

export type PaginatedPaymentTransactions = Pagination<PaymentTransaction>;
