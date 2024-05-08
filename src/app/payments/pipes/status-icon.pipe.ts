import { Pipe, PipeTransform } from '@angular/core';

import { PaymentTransactionStatus } from '../models';
import { paymentTransactionStatusIcon } from '../utils';

@Pipe({
  name: 'statusIcon',
  standalone: true
})
export class StatusIconPipe implements PipeTransform {
  transform(status: PaymentTransactionStatus) {
    return paymentTransactionStatusIcon[status];
  }
}
