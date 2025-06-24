import { ethers } from 'ethers';
import { onTransaction } from './strategy';

export async function initListener() {
  const wsUrl = process.env.ETH_WS_URL!;
  const provider = new ethers.WebSocketProvider(wsUrl);

  provider.on('pending', async (txHash: string) => {
    try {
      const tx = await provider.getTransaction(txHash);
      if (tx && tx.to) {
        await onTransaction(tx, new ethers.JsonRpcProvider(process.env.ETH_WS_URL));
      }
    } catch (err) {
      console.error('Error on pending tx:', err);
    }
  });

  console.log('Listening to pending transactions at', wsUrl);
}
