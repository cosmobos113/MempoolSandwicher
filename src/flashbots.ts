import { ethers } from 'ethers';
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle';

export async function submitBundle(
  txs: Array<ethers.TransactionRequest>,
  gasPrice: ethers.BigNumberish,
  provider: ethers.Provider

) {
  const authSigner = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    process.env.FLASHBOTS_RELAY!
  );

  const signedBundle = await flashbotsProvider.signBundle(
    txs.map((tx) => ({ transaction: tx, signer: authSigner }))
  );

  const blockNumber = await provider.getBlockNumber();
  const bundleResponse = await flashbotsProvider.sendRawBundle(signedBundle, blockNumber + 1);

  console.log('Bundle submitted for block', blockNumber + 1);
  return bundleResponse;
}
