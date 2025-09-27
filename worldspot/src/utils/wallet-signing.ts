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
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask or compatible wallet not found');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

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
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}
