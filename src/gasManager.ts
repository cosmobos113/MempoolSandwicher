import { ethers } from 'ethers';

export async function estimateGasPrice(provider: ethers.Provider): Promise<ethers.BigNumber> {
  try {
    // Dacă rețeaua oferă EIP-1559
    const feeData = await provider.getFeeData();

    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      // Folosim maxFeePerGas ca gasPrice estimat
      return feeData.maxFeePerGas;
    }

    // Fallback la gasPrice clasic
    const gasPrice = await provider.getGasPrice();
    return gasPrice;
  } catch (err) {
    console.warn('Failed to fetch gas price, fallback to default 30 gwei', err);
    return ethers.parseUnits('30', 'gwei');
  }
}
