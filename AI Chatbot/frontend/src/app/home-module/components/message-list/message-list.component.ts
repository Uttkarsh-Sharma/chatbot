import { afterRenderEffect, Component, ElementRef, input, viewChild } from '@angular/core';
import { ChatMessage } from '../../models';

@Component({
  selector: 'app-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss',
})
export class MessageListComponent {
  readonly messages = input.required<ChatMessage[]>();
  readonly isResponding = input(false);

  private readonly _scrollContainer = viewChild.required<ElementRef<HTMLElement>>('scrollContainer');

  constructor() {
    // Keep the newest message in view whenever a message or the typing indicator appears
    afterRenderEffect(() => {
      this.messages();
      this.isResponding();
      const container = this._scrollContainer().nativeElement;
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });
  }
}
