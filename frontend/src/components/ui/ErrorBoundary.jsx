import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-3xl p-8 shadow-xl">
            <span className="text-5xl" role="img" aria-label="warning symbol">⚠️</span>
            <h2 className="text-xl font-display font-bold mt-4 text-gray-900 dark:text-white">Something went wrong</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">
              An unexpected error occurred while rendering this page. The National Informatics Centre network monitoring node has logged this event.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold rounded-xl transition-all shadow-md"
              >
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all border border-gray-200 dark:border-dark-border"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
