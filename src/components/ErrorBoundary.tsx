import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props for ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundaryInner extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error inside boundary:', error, errorInfo);
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-fifa-dark border border-red-500 border-opacity-30 rounded-xl max-w-md mx-auto mt-20">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h2>
          <p className="text-gray-400 mb-6">The application encountered an unexpected runtime error.</p>
          <button
            onClick={(): void => this.setState({ hasError: false })}
            className="px-4 py-2 bg-fifa-gold text-fifa-dark rounded-lg font-semibold hover:bg-opacity-95 transition-all animate-pulse"
            aria-label="Reload and try again"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error boundary component to catch and display UI crashes gracefully.
 * @param props - Component props containing children
 * @returns React.ReactElement
 */
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }): React.ReactElement => {
  return <ErrorBoundaryInner>{children}</ErrorBoundaryInner>;
};
export default ErrorBoundary;
