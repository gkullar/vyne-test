import { PaginatedPaymentTransactions, PaymentTransactionStatus } from '../models';

export const MOCK_PAGINATED_PAYMENTS: PaginatedPaymentTransactions = {
  totalNumberOfItems: 10,
  numberOfPages: 5,
  currentPage: 0,
  pageSize: 2,
  hasNext: true,
  items: [
    {
      id: 'TXID_sdfb-sodj-3gb34-3r3brb',
      amount: 23.35,
      currency: 'GBP',
      description: 'Test payment made only for this technical task #1',
      status: PaymentTransactionStatus.Created,
      createdAt: '2021-07-01T12:27:07.965'
    },
    {
      id: 'TXID_fdgn-sodj-3gb34-3r3brb',
      amount: 34.34,
      currency: 'EUR',
      description: 'Test payment made only for this technical task #2',
      status: PaymentTransactionStatus.Created,
      createdAt: '2021-07-03T12:27:07.965'
    }
  ]
};
