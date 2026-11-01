import { PromptSuggestion } from '../models';

export const MODEL_DISPLAY_NAME = 'Gemini 3.5 Flash';

export const CONVERSATION_TITLE_MAX_LENGTH = 40;

// Fake "thinking" time for the mock reply, until the backend is connected
export const MOCK_REPLY_DELAY_MS = 1200;

export const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  {
    icon: 'ri-lightbulb-flash-line',
    title: 'Explain a concept',
    prompt: 'Explain how JavaScript promises work with a simple example.',
  },
  {
    icon: 'ri-code-s-slash-line',
    title: 'Write some code',
    prompt: 'Write an Express.js route that validates a JSON request body.',
  },
  {
    icon: 'ri-quill-pen-line',
    title: 'Help me write',
    prompt: 'Write a short, friendly email asking my team for project feedback.',
  },
  {
    icon: 'ri-compass-3-line',
    title: 'Plan something',
    prompt: 'Create a 4-week learning plan for building AI agents with Node.js.',
  },
];
