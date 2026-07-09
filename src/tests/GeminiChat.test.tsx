import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GeminiChat } from '../components/GeminiChat';
import type { ChatMessage } from '../types';

describe('GeminiChat Component', () => {
  const mockMessages: ChatMessage[] = [
    { id: '1', role: 'user', content: 'Where is the food?', timestamp: new Date(), language: 'en', persona: 'fan' },
    { id: '2', role: 'assistant', content: 'Nearest food is stand 104.', timestamp: new Date(), language: 'en', persona: 'fan' }
  ];

  it('renders chat message lists', () => {
    render(
      <GeminiChat
        messages={mockMessages}
        loading={false}
        error={null}
        onSendMessage={async () => {}}
        currentPersona="fan"
        currentLanguage="en"
      />
    );

    expect(screen.getByText('Where is the food?')).toBeInTheDocument();
    expect(screen.getByText('Nearest food is stand 104.')).toBeInTheDocument();
  });

  it('triggers onSendMessage on submit', async () => {
    const sendSpy = vi.fn();
    render(
      <GeminiChat
        messages={[]}
        loading={false}
        error={null}
        onSendMessage={sendSpy}
        currentPersona="fan"
        currentLanguage="en"
      />
    );

    const input = screen.getByLabelText('Ask a question about the stadium');
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Best Gate?' } });
    fireEvent.click(sendButton);

    expect(sendSpy).toHaveBeenCalledWith('Best Gate?');
  });
});
