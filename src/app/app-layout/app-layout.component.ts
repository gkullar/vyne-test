import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ContainerComponent } from '@/container';

@Component({
  imports: [MatToolbarModule, ContainerComponent],
  selector: 'app-layout',
  standalone: true,
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLayoutComponent {}
