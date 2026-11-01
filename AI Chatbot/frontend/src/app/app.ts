import { Component, inject } from '@angular/core';
import { ThemeService } from './core/services';

@Component({
  selector: 'app-root',
  standalone: false,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  // Injected here so the saved/OS theme is applied before any page renders
  private readonly _theme = inject(ThemeService);
}
