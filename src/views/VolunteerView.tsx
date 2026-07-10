import React, { useState, useMemo, useCallback, memo } from 'react';
import type { Language } from '../types';
import { getVenueById } from '../utils/stadiumData';
import { GeminiChat } from '../components/GeminiChat';
import { useGemini } from '../hooks/useGemini';
import { ClipboardList, Bell, Calendar, UserCheck, Languages } from 'lucide-react';
import { useTranslate } from '../hooks/useTranslate';

/**
 * Props for VolunteerView.
 */
export interface VolunteerViewProps {
  readonly venueId: string;
  readonly language: Language;
}

interface VolunteerTask {
  readonly id: string;
  readonly task: string;
  readonly done: boolean;
}

/** Memoized Shift Checklist Item */
const ShiftChecklistItem = memo(({
  task,
  onToggle
}: {
  readonly task: VolunteerTask;
  readonly onToggle: (id: string) => void;
}): React.ReactElement => {
  const containerClass = useMemo(() => {
    return task.done
      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through'
      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';
  }, [task.done]);

  return (
    <div
      onClick={(): void => onToggle(task.id)}
      className={`w-full text-left p-3 border rounded-xl flex items-center space-x-3 transition-all cursor-pointer outline-none focus-within:ring-2 focus-within:ring-fifa-gold ${containerClass}`}
      role="checkbox"
      aria-checked={task.done}
      tabIndex={0}
      onKeyDown={(e): void => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle(task.id);
        }
      }}
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={(): void => {}}
        className="rounded bg-slate-800 border-slate-700 text-fifa-gold pointer-events-none focus:ring-0 focus:ring-offset-0"
        aria-hidden="true"
        tabIndex={-1}
      />
      <span className="text-xs font-semibold">{task.task}</span>
    </div>
  );
});
ShiftChecklistItem.displayName = 'ShiftChecklistItem';

/**
 * Volunteer activity view containing task checklists, schedules and guides.
 * Uses React.memo, useMemo, and useCallback to maximize rendering performance.
 * @param props - Venue and language state properties
 * @returns React.ReactElement
 */

/** Supported target languages for volunteer translation */
const TRANSLATE_LANGUAGES: ReadonlyArray<{
  readonly code: Language;
  readonly label: string;
}> = [
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'de', label: 'German' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese' },
  { code: 'hi', label: 'Hindi' },
];

/** Quick multilingual translation tool for volunteers */
const TranslationPanel = memo((): React.ReactElement => {
  const [inputText, setInputText] = useState<string>('');
  const [targetLang, setTargetLang] = useState<Language>('es');
  const [translated, setTranslated] = useState<string>('');
  const { translateText, isTranslating } = useTranslate();

  const handleTranslate = useCallback(async (): Promise<void> => {
    if (!inputText.trim()) return;
    const result = await translateText(inputText, targetLang);
    setTranslated(result);
  }, [inputText, targetLang, translateText]);

  return (
    <section
      className="glass-card rounded-xl p-5"
      aria-labelledby="translate-heading"
    >
      <div className="flex items-center space-x-2.5 mb-4">
        <Languages className="w-5 h-5 text-blue-400" aria-hidden="true" />
        <h3 id="translate-heading" className="text-base font-bold text-white font-outfit">
          Multilingual Fan Assistance
        </h3>
      </div>
      <div className="space-y-3">
        <textarea
          value={inputText}
          onChange={(e): void => setInputText(e.target.value)}
          placeholder="Type fan's message in any language..."
          className="glass-input rounded-lg p-3 text-xs w-full resize-none h-20"
          aria-label="Enter text to translate"
          maxLength={500}
        />
        <div className="flex gap-2">
          <select
            value={targetLang}
            onChange={(e): void => setTargetLang(e.target.value as Language)}
            className="glass-input rounded-lg p-2 text-xs flex-1"
            aria-label="Select target language"
          >
            {TRANSLATE_LANGUAGES.map(({ code, label }): React.ReactElement => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
          <button
            onClick={handleTranslate}
            disabled={isTranslating || !inputText.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
            aria-label="Translate the entered text"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </div>
        {translated && (
          <div
            className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-lg"
            aria-live="polite"
            aria-label="Translation result"
          >
            <p className="text-xs text-blue-300 font-medium mb-1">Translation:</p>
            <p className="text-xs text-white">{translated}</p>
          </div>
        )}
      </div>
    </section>
  );
});
TranslationPanel.displayName = 'TranslationPanel';

export const VolunteerView: React.FC<VolunteerViewProps> = memo(({ venueId, language }): React.ReactElement => {
  const venue = useMemo(() => getVenueById(venueId), [venueId]);
  const { messages, loading, error, sendMessage } = useGemini('volunteer', language, venueId);

  const [tasks, setTasks] = useState<readonly VolunteerTask[]>([
    { id: 't1', task: 'Sign in at Volunteer HQ (Level 1, Room 102)', done: true },
    { id: 't2', task: 'Check Gate C wheelchair elevator accessibility', done: false },
    { id: 't3', task: 'Deploy hydration water stand to Stand 104 concourse', done: false },
    { id: 't4', task: 'Conduct briefing with zone safety leads', done: false }
  ]);

  const completedCount = useMemo(
    () => tasks.filter((t): boolean => t.done).length,
    [tasks]
  );

  const handleToggleTask = useCallback((id: string): void => {
    setTasks((prev): readonly VolunteerTask[] =>
      prev.map((t): VolunteerTask => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Banner Panel ── */}
      {venue && (
        <section className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-950/5" aria-labelledby="console-title">
          <h2 id="console-title" className="text-xl font-bold text-white font-outfit">Volunteer Console • {venue.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Thank you for supporting operations at {venue.city}!</p>
        </section>
      )}

      {/* ── Info Cards Grid ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Volunteer Shift Status">
        <div className="glass-card rounded-xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-fifa-gold/10 rounded-lg text-fifa-gold" aria-hidden="true">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase">My Active Shift</h4>
            <p className="text-sm font-bold text-white mt-0.5">08:00 - 16:00 • Sector A</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400" aria-hidden="true">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase">Task Status</h4>
            <p className="text-sm font-bold text-white mt-0.5" aria-live="polite">
              {completedCount} of {tasks.length} Completed
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400" aria-hidden="true">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase">HQ Contact</h4>
            <p className="text-sm font-bold text-white mt-0.5">Leader: Sarah Miller (Ch. 4)</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* ── Shift Duty Checklist ── */}
          <section className="glass-card rounded-xl p-5" aria-labelledby="checklist-heading">
            <div className="flex items-center space-x-2.5 mb-4">
              <ClipboardList className="w-5 h-5 text-fifa-gold" aria-hidden="true" />
              <h3 id="checklist-heading" className="text-base font-bold text-white font-outfit">My Shift Duty Checklist</h3>
            </div>

            <div className="space-y-3" role="group" aria-label="Shift tasks checklist">
              {tasks.map((task): React.ReactElement => (
                <ShiftChecklistItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                />
              ))}
            </div>
          </section>

          <TranslationPanel />

          {/* ── Announcement Board ── */}
          <section className="glass-card rounded-xl p-5" aria-labelledby="board-heading">
            <div className="flex items-center space-x-2.5 mb-3">
              <Bell className="w-5 h-5 text-fifa-gold" aria-hidden="true" />
              <h3 id="board-heading" className="text-base font-bold text-white font-outfit">Volunteers Board</h3>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <p className="text-xs text-slate-300 font-semibold">Post-match Volunteer Briefing</p>
              <p className="text-2xs text-slate-400 mt-1">
                A brief sync will take place in HQ Room 102 exactly 15 minutes after final whistle. Grab-and-go refreshments will be provided.
              </p>
            </div>
          </section>
        </div>

        <GeminiChat
          messages={messages}
          loading={loading}
          error={error}
          onSendMessage={sendMessage}
          currentPersona="volunteer"
          currentLanguage={language}
        />
      </div>
    </div>
  );
});

VolunteerView.displayName = 'VolunteerView';
export default VolunteerView;
