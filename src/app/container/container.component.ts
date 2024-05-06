import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  imports: [CommonModule],
  selector: 'app-container',
  standalone: true,
  template: '<ng-content></ng-content>',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent {
  @HostBinding('class')
  @Input()
  size: ContainerSize = 'xl';
}
