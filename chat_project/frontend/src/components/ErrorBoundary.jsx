import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 h-full w-full overflow-auto text-red-900 absolute inset-0 z-50">
          <h1 className="text-2xl font-bold mb-4">React UI Crashed</h1>
          <p className="mb-4">An error occurred in ChatWindow. Please send this to the AI:</p>
          <pre className="text-xs bg-red-100 p-4 rounded whitespace-pre-wrap font-mono">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
