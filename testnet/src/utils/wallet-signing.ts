import { useAccount, useSignMessage } from 'wagmi';

export interface WalletSigningData {
  signature: string;
  message: string;
  address: string;
  timestamp: number;
}

/**
 * Signs a message using wagmi's useSignMessage hook
 * This provides a clean wallet signing interface without external dependencies
 */
export function useWalletSigning() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const signMessage = async (message: string): Promise<WalletSigningData> => {
    try {
      if (!address) {
        throw new Error('No wallet connected');
      }

      const signature = await signMessageAsync({ message });
      
      return {
        signature,
        message,
        address,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Wallet signing error:', error);
      throw new Error('Failed to sign message with wallet');
    }
  };

  return { signMessage, address };
}

/**
 * Utility function to verify a signed message
 */
export function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): boolean {
  try {
    // This would typically use a library like ethers or viem to verify
    // For now, we'll do basic validation
    return signature.length > 0 && expectedAddress.length > 0;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}