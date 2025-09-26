import { createWalletClient, createPublicClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

// Types for wallet signing
export interface WalletSigningData {
  publicKey: string;
  signedMessage: string;
}

// Function to sign a message with wallet (you'll need to implement based on your wallet provider)
export async function signMessageWithWallet(message: string): Promise<WalletSigningData> {
  try {
    // This is a placeholder implementation
    // You'll need to integrate with your actual wallet provider (MetaMask, WalletConnect, etc.)
    
    // For development/testing purposes, you can use a private key
    // In production, use proper wallet connection
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY; // Add this to your .env.local
    
    if (!privateKey) {
      throw new Error('Private key not found. Please add NEXT_PUBLIC_PRIVATE_KEY to your environment variables.');
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`);
    
    const walletClient = createWalletClient({
      account,
      chain: mainnet,
      transport: http()
    });

    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http()
    });

    // Sign the message
    const signature = await walletClient.signMessage({
      message: message,
    });

    return {
      publicKey: account.address,
      signedMessage: signature
    };
  } catch (error) {
    console.error('Wallet signing error:', error);
    throw new Error('Failed to sign message with wallet');
  }
}

// Alternative function for browser wallet integration
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
    ethereum?: any;
  }
}
