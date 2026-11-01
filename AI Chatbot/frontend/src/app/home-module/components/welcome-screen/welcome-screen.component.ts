import { Component, output } from '@angular/core';
import { PROMPT_SUGGESTIONS } from '../../constants';

@Component({
  selector: 'app-welcome-screen',
  standalone: false,
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.scss',
})
export class WelcomeScreenComponent {
  readonly suggestionSelected = output<string>();
  readonly suggestions = PROMPT_SUGGESTIONS;
}
