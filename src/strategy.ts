import { ethers, Provider, TransactionResponse } from 'ethers';
import { submitBundle } from './flashbots';
import { estimateGasPrice } from './gasManager';

export async function onTransaction(tx: TransactionResponse, provider: Provider) {
  // Filtrăm doar tranzacțiile către contractul Uniswap V2 Factory
  if (tx.to?.toLowerCase() !== '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f') return;

  const gasPrice = await estimateGasPrice(provider);

  // Exemplu gol pentru bundle-uri — aici trebuie logica reală
  const bundleTxs: ethers.TransactionRequest[] = [];

  await submitBundle(bundleTxs, gasPrice, provider);
}
