import { Provider, BigNumber } from 'ethers';

export async function estimateGasPrice(provider: Provider): Promise<BigNumber> {
  try {
    const feeData = await provider.getFeeData();
    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      // Folosește maxFeePerGas ca preț gaz (fallback la maxPriorityFeePerGas dacă nu există)
      return feeData.maxFeePerGas;
    } else if (feeData.gasPrice) {
      // fallback pentru rețele mai vechi sau non EIP-1559
      return feeData.gasPrice;
    } else {
      // fallback implicit
      return BigNumber.from('0');
    }
  } catch (error) {
    console.error('Eroare la estimarea gas price:', error);
    return BigNumber.from('0');
  }
}
