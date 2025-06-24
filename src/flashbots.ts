import { ethers } from 'ethers';
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle';

const FLASHBOTS_RELAY = process.env.FLASHBOTS_RELAY || 'https://relay.flashbots.net';
const CHAIN_ID = Number(process.env.CHAIN_ID || '1');
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

if (!PRIVATE_KEY) {
  throw new Error('Missing PRIVATE_KEY in .env');
}

const wallet = new ethers.Wallet(PRIVATE_KEY);

let flashbotsProvider: FlashbotsBundleProvider | null = null;

export async function getFlashbotsProvider(
  provider: ethers.Provider
): Promise<FlashbotsBundleProvider> {
  if (flashbotsProvider) return flashbotsProvider;

  flashbotsProvider = await FlashbotsBundleProvider.create(provider, wallet, FLASHBOTS_RELAY);
  return flashbotsProvider;
}

/**
 * Submită un bundle de tranzacții prin Flashbots
 */
export async function submitBundle(
  transactions: ethers.TransactionRequest[],
  gasPrice: ethers.BigNumberish,
  provider: ethers.Provider
) {
  const fbProvider = await getFlashbotsProvider(provider);

  // Pregătim tranzacțiile semnate
  const signedTxs = await Promise.all(
    transactions.map(async (tx) => {
      if (tx.signer) {
        return await tx.signer.signTransaction(tx);
      }
      throw new Error('Transaction missing signer');
    })
  );

  const blockNumber = await provider.getBlockNumber();
  const targetBlock = blockNumber + 1;

  const bundleResponse = await fbProvider.sendBundle(signedTxs, targetBlock);

  if ('error' in bundleResponse) {
    console.error('Flashbots bundle error:', bundleResponse.error.message);
    return;
  }

  console.log(`Bundle submitted for block ${targetBlock}`);

  const waitResponse = await bundleResponse.wait();

  if (waitResponse === 0) {
    console.log('Bundle included!');
  } else {
    console.warn('Bundle not included:', waitResponse);
  }
}
