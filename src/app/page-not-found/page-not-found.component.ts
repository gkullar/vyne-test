import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageNotFoundRoutingModule } from './page-not-found-routing.module';
import { ContainerComponent } from '@/container';

@Component({
  imports: [PageNotFoundRoutingModule, ContainerComponent],
  selector: 'app-page-not-found',
  standalone: true,
  templateUrl: './page-not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent {}
