import React from 'react';

/**
 * Props for the SkipNavLink component.
 */
export interface SkipNavLinkProps {
  /** Target anchor element ID to scroll to */
  readonly targetId: string;
}

/**
 * Accessibility skip link to bypass navigation.
 * @param props - Component props containing target anchor
 * @returns React.ReactElement
 */
export const SkipNavLink: React.FC<SkipNavLinkProps> = ({ targetId }): React.ReactElement => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-fifa-gold focus:text-fifa-dark focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold focus:z-50 focus:outline-none"
    >
      Skip to main content
    </a>
  );
};
