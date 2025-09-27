import { MiniKit } from '@worldcoin/minikit-js';

// Types for wallet signing
export interface WalletSigningData {
  publicKey: string;
  signedMessage: string;
}

/**
 * Signs a message using WorldCoin MiniKit SDK commands
 * This integrates seamlessly with your existing WorldCoin authentication flow
 */
export async function signMessageWithWorldCoin(message: string): Promise<WalletSigningData> {
  try {
    // Use MiniKit's signMessage command
    const result = await MiniKit.commandsAsync.signMessage({
      message: message,
    });

    if (!result) {
      throw new Error('No response from MiniKit signMessage');
    }

    if (result.finalPayload.status !== 'success') {
      console.error('MiniKit signMessage failed', result.finalPayload.error_code);
      throw new Error(`Signing failed: ${result.finalPayload.error_code}`);
    }

    // Extract the signature and public key from the result
    const signature = result.finalPayload.signature;
    const publicKey = result.finalPayload.address;

    return {
      publicKey: publicKey,
      signedMessage: signature
    };
  } catch (error) {
    console.error('WorldCoin MiniKit signing error:', error);
    throw new Error('Failed to sign message with WorldCoin MiniKit');
  }
}

/**
 * Alternative function for browser wallet integration (fallback)
 * Keep this as a backup option if MiniKit is not available
 */
export async function signMessageWithBrowserWallet(message: string): Promise<WalletSigningData> {
  if (!isWalletAvailable()) {
    throw new Error('MetaMask or compatible wallet not found');
  }

  try {
    // Check if wallet is available and connected (with error handling)
    let isConnected = false;
    try {
      isConnected = window.ethereum.isConnected ? window.ethereum.isConnected() : false;
    } catch (connectionError) {
      console.warn('Wallet connection check failed:', connectionError);
      // Continue without connection check if it fails
    }

    if (!isConnected) {
      console.log('Wallet not connected, attempting to connect...');
    }

    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    if (!account) {
      throw new Error('No account found');
    }

    // Sign the message
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, account],
    });

    return {
      publicKey: account,
      signedMessage: signature
    };
  } catch (error) {
    console.error('Browser wallet signing error:', error);
    throw new Error('Failed to sign message with browser wallet');
  }
}

// Declare global window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isConnected?: () => boolean;
      on?: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener?: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}

/**
 * Safely check if a wallet is available without triggering extension errors
 */
export function isWalletAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return !!(window.ethereum && typeof window.ethereum.request === 'function');
  } catch (error) {
    // Silently catch any extension errors
    console.warn('Wallet availability check failed:', error);
    return false;
  }
}
