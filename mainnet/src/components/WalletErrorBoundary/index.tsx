'use client';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class WalletErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a wallet-related error
    const isWalletError = 
      error.message.includes('wallet') ||
      error.message.includes('ethereum') ||
      error.message.includes('MetaMask') ||
      error.message.includes('extension') ||
      error.stack?.includes('chrome-extension://');

    if (isWalletError) {
      console.warn('Wallet-related error caught by boundary:', error);
      return { hasError: true, error };
    }

    // Re-throw non-wallet errors
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Only log wallet-related errors
    if (this.state.hasError) {
      console.warn('Wallet error boundary caught:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Wallet Extension Issue
              </h3>
              <p className="text-xs text-yellow-700 mt-1">
                There was an issue with a wallet extension. This won't affect the main functionality.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
