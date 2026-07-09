import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, Persona, Language } from '../types';
import { Send, Bot, User, Volume2, Sparkles, AlertTriangle } from 'lucide-react';

/**
 * Props for GeminiChat.
 */
export interface GeminiChatProps {
  readonly messages: readonly ChatMessage[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly onSendMessage: (text: string) => Promise<void>;
  readonly currentPersona: Persona;
  readonly currentLanguage: Language;
}

/**
 * Accessible GenAI assistant chat view with predefined quick prompts and TTS support.
 * @param props - Conversational parameters and handlers
 * @returns React.ReactElement
 */
export const GeminiChat: React.FC<GeminiChatProps> = ({
  messages,
  loading,
  error,
  onSendMessage,
  currentPersona,
  currentLanguage
}): React.ReactElement => {
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts: Record<Persona, string[]> = {
    fan: [
      'Where is the nearest food court?',
      'Which gates have the shortest queues?',
      'How do I take the metro transit?'
    ],
    staff: [
      'Gate crowd bottleneck protocol',
      'Report card reader malfunction',
      'Weather alert updates'
    ],
    volunteer: [
      'Shift timings and volunteer break rooms',
      'Where is the info kiosk at Gate A?',
      'How to guide visually impaired fans?'
    ],
    organizer: [
      'Summarize current sustainability metrics',
      'Crowd flow risk assessment summary',
      'Average gate entry duration report'
    ]
  };

  const activePrompts = quickPrompts[currentPersona] || quickPrompts.fan;

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect((): void => {
    scrollToBottom();
  }, [messages, loading]);

  /**
   * Submits the user prompt message.
   * @returns void
   */
  const handleSend = (): void => {
    if (!input.trim() || loading) {
      return;
    }
    onSendMessage(input);
    setInput('');
  };

  /**
   * Utilizes web speech API to read the assistant response aloud.
   * @param text - Assistant reply message content
   * @returns void
   */
  const handleSpeak = (text: string): void => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col h-[500px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center space-x-2.5">
          <Bot className="w-5 h-5 text-fifa-gold" aria-hidden="true" />
          <div>
            <h3 className="text-base font-bold text-white font-outfit">StadiumIQ Assistant</h3>
            <p className="text-2xs text-slate-400 font-medium capitalize">Persona: {currentPersona} • Mode: Streaming</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Sparkles className="w-4 h-4 text-fifa-gold animate-pulse" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Bot className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-sm font-semibold text-slate-400">Ask me anything about seating, queues, or transport details.</p>
            <p className="text-2xs text-slate-500 mt-1 max-w-[280px]">AI advice is configured dynamically for the {currentPersona} view.</p>
          </div>
        ) : (
          messages.map((msg): React.ReactElement => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`p-2 rounded-lg flex-shrink-0 ${msg.role === 'user' ? 'bg-fifa-gold/15 border border-fifa-gold/25' : 'bg-slate-800 border border-slate-700'}`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-fifa-gold" aria-hidden="true" />
                ) : (
                  <Bot className="w-4 h-4 text-slate-300" aria-hidden="true" />
                )}
              </div>
              <div className="flex flex-col">
                <div className={`p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-fifa-gold text-fifa-dark font-semibold'
                    : 'bg-slate-900 border border-slate-800 text-slate-100 font-normal'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && msg.content && (
                  <button
                    onClick={(): void => handleSpeak(msg.content)}
                    className="self-start mt-1.5 flex items-center space-x-1 text-2xs text-slate-400 hover:text-fifa-gold transition-colors"
                    aria-label="Read text aloud using speech synthesis"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Speak text</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center space-x-2 text-2xs text-slate-400 italic">
            <span className="w-1.5 h-1.5 rounded-full bg-fifa-gold animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-fifa-gold animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-fifa-gold animate-bounce [animation-delay:0.4s]" />
            <span>AI is writing...</span>
          </div>
        )}
        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-lg text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <div className="mb-4">
          <h4 className="text-2xs font-bold uppercase tracking-wider text-slate-500 mb-2">Suggested Actions</h4>
          <div className="flex flex-wrap gap-2">
            {activePrompts.map((prompt, idx): React.ReactElement => (
              <button
                key={idx}
                onClick={(): void => { setInput(prompt); }}
                className="text-2xs font-semibold px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:border-fifa-gold/30 hover:bg-slate-800 text-slate-300 transition-colors"
                aria-label={`Type suggestion: ${prompt}`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e): void => setInput(e.target.value)}
          onKeyDown={(e): void => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Ask about stadium wait times or gate access..."
          className="flex-1 glass-input rounded-lg p-2.5 text-sm"
          aria-label="Ask a question about the stadium"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="p-2.5 bg-fifa-gold hover:bg-opacity-95 text-fifa-dark font-bold rounded-lg transition-all shadow disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default GeminiChat;
