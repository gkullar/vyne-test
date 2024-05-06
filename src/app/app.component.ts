import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppLayoutComponent } from './app-layout';

@Component({
  imports: [RouterOutlet, AppLayoutComponent],
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {}
