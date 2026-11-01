import { computed, Injectable, signal } from '@angular/core';
import { ChatMessage, Conversation, MessageRole } from '../models';
import { CONVERSATION_TITLE_MAX_LENGTH, MOCK_REPLY_DELAY_MS } from '../constants';

/**
 * Holds all chat state for the UI (conversations, active chat, responding flag).
 * Components read the signals and call the methods — they never mutate state directly.
 */
@Injectable({ providedIn: 'root' })
export class ChatDataService {
  private readonly _conversations = signal<Conversation[]>([]);
  private readonly _activeConversationId = signal<string | null>(null);
  private readonly _isResponding = signal(false);
  private _pendingReply: ReturnType<typeof setTimeout> | null = null;

  readonly conversations = computed(() =>
    [...this._conversations()].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
  );
  readonly activeConversationId = this._activeConversationId.asReadonly();
  readonly activeConversation = computed(
    () => this._conversations().find((c) => c.id === this._activeConversationId()) ?? null,
  );
  readonly isResponding = this._isResponding.asReadonly();

  startNewChat(): void {
    this.stopResponse();
    this._activeConversationId.set(null);
  }

  selectConversation(conversationId: string): void {
    if (conversationId === this._activeConversationId()) return;
    this.stopResponse();
    this._activeConversationId.set(conversationId);
  }

  deleteConversation(conversationId: string): void {
    if (conversationId === this._activeConversationId()) {
      this.startNewChat();
    }
    this._conversations.update((list) => list.filter((c) => c.id !== conversationId));
  }

  sendMessage(content: string): void {
    const prompt = content.trim();
    if (!prompt || this._isResponding()) return;

    const conversationId = this._activeConversationId() ?? this._createConversation(prompt);
    this._appendMessage(conversationId, this._createMessage('user', prompt));
    this._requestReply(conversationId, prompt);
  }

  stopResponse(): void {
    if (this._pendingReply) {
      clearTimeout(this._pendingReply);
      this._pendingReply = null;
    }
    this._isResponding.set(false);
  }

  // TODO(backend): replace the mock with a call to the backend's POST /chat endpoint
  private _requestReply(conversationId: string, prompt: string): void {
    this._isResponding.set(true);

    this._pendingReply = setTimeout(() => {
      this._appendMessage(conversationId, this._createMessage('assistant', this._getMockReply(prompt)));
      this._pendingReply = null;
      this._isResponding.set(false);
    }, MOCK_REPLY_DELAY_MS);
  }

  private _getMockReply(prompt: string): string {
    return (
      `You asked: "${prompt}"\n\n` +
      'This is a placeholder reply — the backend is not connected yet. ' +
      'Once we wire up the /chat endpoint, Gemini will answer here.'
    );
  }

  private _createConversation(firstPrompt: string): string {
    const now = new Date();
    const conversation: Conversation = {
      id: crypto.randomUUID(),
      title: this._buildTitle(firstPrompt),
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    this._conversations.update((list) => [conversation, ...list]);
    this._activeConversationId.set(conversation.id);
    return conversation.id;
  }

  private _appendMessage(conversationId: string, message: ChatMessage): void {
    this._conversations.update((list) =>
      list.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message], updatedAt: message.createdAt }
          : c,
      ),
    );
  }

  private _createMessage(role: MessageRole, content: string, isError = false): ChatMessage {
    return { id: crypto.randomUUID(), role, content, createdAt: new Date(), isError };
  }

  private _buildTitle(prompt: string): string {
    const singleLine = prompt.replace(/\s+/g, ' ');
    return singleLine.length > CONVERSATION_TITLE_MAX_LENGTH
      ? `${singleLine.slice(0, CONVERSATION_TITLE_MAX_LENGTH).trimEnd()}…`
      : singleLine;
  }
}
