import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '';

/**
 * Displays a centered container with optional sizes.
 * Containers should **not** be nested.
 * */
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
  size: ContainerSize = '';
}
