import { ethers } from 'ethers';
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle';

const ETH_RPC_URL = process.env.ETH_RPC_URL!;
const FLASHBOTS_RELAY = process.env.FLASHBOTS_RELAY!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

async function main() {
  const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const flashbotsProvider = await FlashbotsBundleProvider.create(provider, wallet, FLASHBOTS_RELAY);
  const nonce = await wallet.getTransactionCount();

  const tx = {
    to: '0x1111111111111111111111111111111111111111',
    value: ethers.parseEther('0.001'),
    gasLimit: 21000,
    maxFeePerGas: ethers.parseUnits('100', 'gwei'),
    maxPriorityFeePerGas: ethers.parseUnits('3', 'gwei'),
    nonce,
    type: 2,
    chainId: 1,
  };

  const signedBundle = await flashbotsProvider.signBundle([
    { signer: wallet, transaction: tx }
  ]);

  provider.on('block', async (blockNumber) => {
    console.log('New block:', blockNumber);
    const target = blockNumber + 1;
    const response = await flashbotsProvider.sendBundle(signedBundle, target);

    if ('error' in response) {
      console.error('Bundle error:', response.error.message);
    } else {
      const receipt = await response.wait();
      console.log(receipt === 0 ? 'Bundle included' : 'Bundle not included');
    }
  });
}

main().catch(console.error);
