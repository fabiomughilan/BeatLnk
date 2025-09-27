import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

// DataCoin contract configuration
const CONTRACT_ADDRESS = "0xa473726d071e483c4960e27c13ed8f1427c3d687";
const NETWORK_RPC = "https://sepolia.infura.io/v3/your-infura-key"; // Replace with your RPC
const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY; // Private key of the minter wallet

// DataCoin ABI (simplified for minting)
const DATACOIN_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, amount, message, signature } = await req.json();

    // Validate input
    if (!walletAddress || !amount || !message || !signature) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters'
      }, { status: 400 });
    }

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json({
        success: false,
        error: 'Invalid signature - does not match wallet address'
      }, { status: 400 });
    }

    // Check if minter private key is configured
    if (!MINTER_PRIVATE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Minter private key not configured'
      }, { status: 500 });
    }

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(NETWORK_RPC);
    const wallet = new ethers.Wallet(MINTER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DATACOIN_ABI, wallet);

    // Get optimal gas settings
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice ? feeData.gasPrice * 150n / 100n : ethers.parseUnits("2", "gwei");
    
    console.log('Minting tokens:', {
      to: walletAddress,
      amount: amount,
      gasPrice: ethers.formatUnits(gasPrice, "gwei") + " gwei"
    });

    // Mint tokens
    const mintTx = await contract.mint(
      walletAddress,
      ethers.parseUnits(amount.toString(), 18),
      {
        gasPrice: gasPrice,
        gasLimit: 500000
      }
    );

    // Wait for transaction confirmation
    const receipt = await mintTx.wait();

    console.log('Minting successful:', {
      txHash: mintTx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    });

    return NextResponse.json({
      success: true,
      txHash: mintTx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      message: 'Tokens minted successfully'
    });

  } catch (error) {
    console.error('Minting error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('replacement fee too low')) {
        return NextResponse.json({
          success: false,
          error: 'Transaction failed due to low gas fee. Please try again.',
          details: error.message
        }, { status: 400 });
      }
      
      if (error.message.includes('insufficient funds')) {
        return NextResponse.json({
          success: false,
          error: 'Insufficient funds for gas fees',
          details: error.message
        }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to mint tokens',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
