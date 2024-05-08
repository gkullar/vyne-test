import { PaymentTransactionStatus } from '../models';

export const paymentTransactionStatusIcon: Record<PaymentTransactionStatus, string> = {
  [PaymentTransactionStatus.Captured]: 'adjust',
  [PaymentTransactionStatus.Completed]: 'check_circle',
  [PaymentTransactionStatus.Created]: 'add_box',
  [PaymentTransactionStatus.Failed]: 'report',
  [PaymentTransactionStatus.Settled]: 'handshake'
};
