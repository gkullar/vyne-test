import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-container',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent {
  @HostBinding('class')
  @Input()
  size: ContainerSize = 'xl';
}
