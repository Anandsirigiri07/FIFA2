import React, { useState } from 'react';
import type { Language } from '../types';
import { getVenueById } from '../utils/stadiumData';
import { GeminiChat } from '../components/GeminiChat';
import { useGemini } from '../hooks/useGemini';
import { ClipboardList, Bell, Calendar, UserCheck } from 'lucide-react';

/**
 * Props for VolunteerView.
 */
export interface VolunteerViewProps {
  readonly venueId: string;
  readonly language: Language;
}

interface VolunteerTask {
  id: string;
  task: string;
  done: boolean;
}

/**
 * Volunteer activity view containing task checklists, schedules and guides.
 * @param props - Venue and language state properties
 * @returns React.ReactElement
 */
export const VolunteerView: React.FC<VolunteerViewProps> = ({ venueId, language }): React.ReactElement => {
  const venue = getVenueById(venueId);
  const { messages, loading, error, sendMessage } = useGemini('volunteer', language);

  const [tasks, setTasks] = useState<VolunteerTask[]>([
    { id: 't1', task: 'Sign in at Volunteer HQ (Level 1, Room 102)', done: true },
    { id: 't2', task: 'Check Gate C wheelchair elevator accessibility', done: false },
    { id: 't3', task: 'Deploy hydration water stand to Stand 104 concourse', done: false },
    { id: 't4', task: 'Conduct briefing with zone safety leads', done: false }
  ]);

  /**
   * Toggles the completion state of a checklist task.
   * @param id - Task ID
   * @returns void
   */
  const toggleTask = (id: string): void => {
    setTasks((prev): VolunteerTask[] =>
      prev.map((t): VolunteerTask => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="space-y-6">
      {venue && (
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-950/5">
          <h2 className="text-xl font-bold text-white font-outfit">Volunteer Console • {venue.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Thank you for supporting operations at {venue.city}!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-fifa-gold/10 rounded-lg text-fifa-gold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase">My Active Shift</h4>
            <p className="text-sm font-bold text-white mt-0.5">08:00 - 16:00 • Sector A</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase">Task Status</h4>
            <p className="text-sm font-bold text-white mt-0.5">
              {tasks.filter((t): boolean => t.done).length} of {tasks.length} Completed
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase">HQ Contact</h4>
            <p className="text-sm font-bold text-white mt-0.5">Leader: Sarah Miller (Ch. 4)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center space-x-2.5 mb-4">
              <ClipboardList className="w-5 h-5 text-fifa-gold" />
              <h3 className="text-base font-bold text-white font-outfit">My Shift Duty Checklist</h3>
            </div>

            <div className="space-y-3">
              {tasks.map((task): React.ReactElement => (
                <button
                  key={task.id}
                  onClick={(): void => toggleTask(task.id)}
                  className={`w-full text-left p-3 border rounded-xl flex items-center space-x-3 transition-all outline-none ${
                    task.done
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                  aria-label={`Toggle task: ${task.task}. Status is currently ${task.done ? 'done' : 'incomplete'}.`}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={(): void => {}}
                    className="rounded bg-slate-800 border-slate-700 text-fifa-gold pointer-events-none"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold">{task.task}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center space-x-2.5 mb-3">
              <Bell className="w-5 h-5 text-fifa-gold" />
              <h3 className="text-base font-bold text-white font-outfit">Volunteers Board</h3>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <p className="text-xs text-slate-300 font-semibold">Post-match Volunteer Briefing</p>
              <p className="text-2xs text-slate-400 mt-1">
                A brief sync will take place in HQ Room 102 exactly 15 minutes after final whistle. Grab-and-go refreshments will be provided.
              </p>
            </div>
          </div>
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
};
export default VolunteerView;
