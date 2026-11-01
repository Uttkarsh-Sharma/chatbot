import { Component, computed, inject, output } from '@angular/core';
import { ChatDataService } from '../../services';
import { ThemeService } from '../../../core/services';
import { Conversation, ConversationGroup } from '../../models';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly _chatData = inject(ChatDataService);
  private readonly _theme = inject(ThemeService);

  readonly closeSidebar = output<void>();
  readonly conversationSelected = output<void>();

  readonly activeConversationId = this._chatData.activeConversationId;
  readonly isDarkTheme = computed(() => this._theme.theme() === 'dark');

  readonly conversationGroups = computed<ConversationGroup[]>(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const today: Conversation[] = [];
    const earlier: Conversation[] = [];
    for (const conversation of this._chatData.conversations()) {
      (conversation.updatedAt >= startOfToday ? today : earlier).push(conversation);
    }

    return [
      { label: 'Today', conversations: today },
      { label: 'Earlier', conversations: earlier },
    ].filter((group) => group.conversations.length > 0);
  });

  startNewChat(): void {
    this._chatData.startNewChat();
    this.conversationSelected.emit();
  }

  selectConversation(conversationId: string): void {
    this._chatData.selectConversation(conversationId);
    this.conversationSelected.emit();
  }

  deleteConversation(event: Event, conversationId: string): void {
    event.stopPropagation(); // don't also select the row being deleted
    this._chatData.deleteConversation(conversationId);
  }

  toggleTheme(): void {
    this._theme.toggleTheme();
  }
}
