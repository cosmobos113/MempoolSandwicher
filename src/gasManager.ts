import { Provider } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';

export async function estimateGasPrice(provider: Provider): Promise<BigNumber> {
  try {
    const feeData = await provider.getFeeData();
    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      return feeData.maxFeePerGas;
    } else if (feeData.gasPrice) {
      return feeData.gasPrice;
    } else {
      return BigNumber.from('0');
    }
  } catch (error) {
    console.error('Eroare la estimarea gas price:', error);
    return BigNumber.from('0');
  }
}
