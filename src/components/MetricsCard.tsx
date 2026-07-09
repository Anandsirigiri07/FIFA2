import React, { ReactNode, memo, useMemo } from 'react';

/**
 * Props for MetricsCard.
 */
export interface MetricsCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly subtitle?: string;
  readonly icon?: ReactNode;
  readonly trend?: {
    readonly value: string;
    readonly type: 'up' | 'down' | 'neutral';
  };
}

/**
 * Glassmorphic status metric card UI display.
 * Uses React.memo for high performance and proper ARIA layout for accessibility.
 * @param props - Card data properties
 * @returns React.ReactElement
 */
export const MetricsCard: React.FC<MetricsCardProps> = memo(({
  title,
  value,
  subtitle,
  icon,
  trend
}): React.ReactElement => {
  const trendColor = useMemo(() => {
    if (!trend) return '';
    return trend.type === 'up'
      ? 'text-emerald-400'
      : trend.type === 'down'
      ? 'text-rose-400'
      : 'text-slate-400';
  }, [trend]);

  return (
    <div
      className="glass-card rounded-xl p-5 hover:scale-[1.02] transition-transform duration-300"
      role="region"
      aria-label={`${title} Metric Card`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-400 tracking-wider uppercase">{title}</h3>
        {icon && <div className="text-fifa-gold" aria-hidden="true">{icon}</div>}
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold font-outfit text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold ${trendColor}`} aria-label={`Trend: ${trend.value}`}>
            {trend.value}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
});

MetricsCard.displayName = 'MetricsCard';
export default MetricsCard;
