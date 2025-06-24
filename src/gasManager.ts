import { ethers } from 'ethers';

export async function estimateGasPrice(provider: ethers.JsonRpcProvider): Promise<ethers.BigNumber> {
  const feeData = await provider.getFeeData();
  return feeData.maxFeePerGas!;
}
