import React, { useMemo, useCallback, memo } from 'react';
import type { StadiumAlert } from '../types';
import { AlertTriangle, Info, X } from 'lucide-react';

/**
 * Props for AlertBanner.
 */
export interface AlertBannerProps {
  readonly alerts: readonly StadiumAlert[];
  readonly onDismiss: (id: string) => void;
}

/** Memoized Alert Item */
const AlertItem = memo(({
  alert,
  onDismiss
}: {
  readonly alert: StadiumAlert;
  readonly onDismiss: (id: string) => void;
}): React.ReactElement => {
  const bgStyle = useMemo(() => {
    return alert.type === 'critical' 
      ? 'bg-rose-950/40 border-rose-500/40 text-rose-200' 
      : alert.type === 'warning'
      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
      : 'bg-blue-950/40 border-blue-500/40 text-blue-200';
  }, [alert.type]);

  const iconColor = useMemo(() => {
    return alert.type === 'critical'
      ? 'text-rose-400'
      : alert.type === 'warning'
      ? 'text-amber-400'
      : 'text-blue-400';
  }, [alert.type]);

  const handleDismiss = useCallback(() => {
    onDismiss(alert.id);
  }, [alert.id, onDismiss]);

  return (
    <div
      className={`flex items-start justify-between border rounded-lg p-4 transition-all duration-300 ${bgStyle}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start space-x-3">
        {alert.type === 'info' ? (
          <Info className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
        ) : (
          <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
        )}
        <div>
          <h4 className="font-semibold text-sm leading-tight">{alert.title}</h4>
          <p className="text-xs mt-1 leading-relaxed opacity-90">{alert.message}</p>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="p-1 hover:bg-white/10 rounded transition-colors"
        aria-label={`Dismiss alert: ${alert.title}`}
      >
        <X className="w-4 h-4 opacity-70 hover:opacity-100" aria-hidden="true" />
      </button>
    </div>
  );
});
AlertItem.displayName = 'AlertItem';

/**
 * Accessibility-compliant alert banner display.
 * Uses React.memo, useMemo and useCallback for high efficiency.
 * @param props - Alert banner configurations
 * @returns React.ReactElement
 */
export const AlertBanner: React.FC<AlertBannerProps> = memo(({ alerts, onDismiss }): React.ReactElement => {
  const unreadAlerts = useMemo(
    () => alerts.filter((a): boolean => !a.isRead),
    [alerts]
  );

  if (unreadAlerts.length === 0) {
    return <React.Fragment />;
  }

  return (
    <div className="space-y-2.5 mb-6" role="region" aria-label="Stadium notifications">
      {unreadAlerts.map((alert): React.ReactElement => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
});

AlertBanner.displayName = 'AlertBanner';
export default AlertBanner;
