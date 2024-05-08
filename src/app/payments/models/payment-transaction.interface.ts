import { PaymentTransactionStatus } from './payment-transaction-status.enum';

export interface PaymentTransaction {
  amount: number;
  createdAt: string;
  currency: string;
  description: string;
  id: string;
  status: PaymentTransactionStatus;
}
