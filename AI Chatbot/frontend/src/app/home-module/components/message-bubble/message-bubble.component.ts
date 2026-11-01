import { Component, input, OnDestroy, signal } from '@angular/core';
import { ChatMessage } from '../../models';

const COPIED_FEEDBACK_MS = 1500;

@Component({
  selector: 'app-message-bubble',
  standalone: false,
  templateUrl: './message-bubble.component.html',
  styleUrl: './message-bubble.component.scss',
})
export class MessageBubbleComponent implements OnDestroy {
  readonly message = input.required<ChatMessage>();
  readonly isCopied = signal(false);

  private _copiedTimer: ReturnType<typeof setTimeout> | null = null;

  async copyMessage(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.message().content);
      this.isCopied.set(true);
      if (this._copiedTimer) clearTimeout(this._copiedTimer);
      this._copiedTimer = setTimeout(() => this.isCopied.set(false), COPIED_FEEDBACK_MS);
    } catch {
      // Clipboard can be unavailable (non-secure context or denied permission)
    }
  }

  ngOnDestroy(): void {
    if (this._copiedTimer) clearTimeout(this._copiedTimer);
  }
}
