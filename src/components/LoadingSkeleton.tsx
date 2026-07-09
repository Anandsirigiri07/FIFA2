import React from 'react';

/**
 * Props for LoadingSkeleton component.
 */
export interface LoadingSkeletonProps {
  /** Style of loading skeleton */
  readonly type?: 'card' | 'list' | 'title';
  /** Quantity of items to render */
  readonly count?: number;
}

/**
 * Loading state placeholder skeleton screen.
 * @param props - Type and count options
 * @returns React.ReactElement
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 1 }): React.ReactElement => {
  const items = Array.from({ length: count });

  if (type === 'title') {
    return (
      <div className="h-8 bg-slate-800 rounded animate-pulse w-1/3 mb-4" />
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {items.map((_, idx): React.ReactElement => (
          <div key={idx} className="flex items-center space-x-4 p-3 bg-slate-900 border border-slate-800 rounded-lg animate-pulse">
            <div className="rounded-full bg-slate-800 h-10 w-10" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-800 rounded w-1/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, idx): React.ReactElement => (
        <div key={idx} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-2/3" />
          <div className="h-20 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};
export default LoadingSkeleton;
