import { ethers } from 'ethers';
import { submitBundle } from './flashbots';
import { estimateGasPrice } from './gasManager';

export async function onTransaction(tx: ethers.TransactionResponse, provider: ethers.WebSocketProvider) {
  // Exemplu: filtrează doar contractul Uniswap V2 Factory
  if (tx.to?.toLowerCase() !== '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f') return;

  const gasPrice = await estimateGasPrice(provider);

  // Placeholder - în viitor vom crea bundle-urile reale
  const bundleTxs: ethers.TransactionRequest[] = [];

  await submitBundle(bundleTxs, gasPrice, provider);
}
