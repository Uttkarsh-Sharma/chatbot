import { Component, computed, inject, input, output } from '@angular/core';
import { ChatDataService } from '../../services';
import { MODEL_DISPLAY_NAME } from '../../constants';

@Component({
  selector: 'app-chat-header',
  standalone: false,
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
})
export class ChatHeaderComponent {
  private readonly _chatData = inject(ChatDataService);

  readonly isSidebarOpen = input.required<boolean>();
  readonly toggleSidebar = output<void>();
  readonly conversationSelected = output<void>();

  readonly modelName = MODEL_DISPLAY_NAME;
  readonly title = computed(() => this._chatData.activeConversation()?.title ?? 'New chat');

  startNewChat(): void {
    this._chatData.startNewChat();
    this.conversationSelected.emit();
  }
}
