import { Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';

const MAX_TEXTAREA_HEIGHT_PX = 200;

@Component({
  selector: 'app-chat-input',
  standalone: false,
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent {
  readonly isResponding = input(false);
  readonly send = output<string>();
  readonly stop = output<void>();

  readonly message = signal('');
  readonly canSend = computed(() => this.message().trim().length > 0 && !this.isResponding());

  private readonly _textarea = viewChild.required<ElementRef<HTMLTextAreaElement>>('textarea');

  onInput(event: Event): void {
    this.message.set((event.target as HTMLTextAreaElement).value);
    this._resizeTextarea();
  }

  // Enter sends, Shift + Enter adds a new line (isComposing guards IME input)
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      this.submit();
    }
  }

  submit(): void {
    if (!this.canSend()) return;

    this.send.emit(this.message().trim());
    this.message.set('');

    const textarea = this._textarea().nativeElement;
    textarea.value = '';
    this._resizeTextarea();
    textarea.focus();
  }

  private _resizeTextarea(): void {
    const textarea = this._textarea().nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)}px`;
  }
}
