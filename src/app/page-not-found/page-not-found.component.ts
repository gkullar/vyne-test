import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContainerComponent } from '@/container';

@Component({
  imports: [ContainerComponent],
  selector: 'app-page-not-found',
  standalone: true,
  templateUrl: './page-not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent {}
