import { Component, computed, inject, signal } from '@angular/core';
import { ChatDataService } from '../../services';

const MOBILE_BREAKPOINT_PX = 768;

@Component({
  selector: 'app-chat-page',
  standalone: false,
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss',
})
export class ChatPageComponent {
  private readonly _chatData = inject(ChatDataService);

  readonly isSidebarOpen = signal(!this._isMobile());
  readonly messages = computed(() => this._chatData.activeConversation()?.messages ?? []);
  readonly isResponding = this._chatData.isResponding;

  toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  // On mobile the sidebar overlays the chat, so close it once the user picks a chat
  onConversationSelected(): void {
    if (this._isMobile()) this.closeSidebar();
  }

  sendMessage(prompt: string): void {
    this._chatData.sendMessage(prompt);
  }

  stopResponse(): void {
    this._chatData.stopResponse();
  }

  private _isMobile(): boolean {
    return window.innerWidth <= MOBILE_BREAKPOINT_PX;
  }
}
