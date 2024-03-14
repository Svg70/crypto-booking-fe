import { ethers } from "ethers";

export const getNonceUrlProvider = async (
  userAddress: string,
  tokenContractAddress: string,
  abi: any
) => {
  const provider = new ethers.JsonRpcProvider(
    process.env.REACT_APP_RPC_URL
  );
  const signer = await provider.getSigner(userAddress);

  const contract = new ethers.Contract(tokenContractAddress, abi, signer);

  const nonces = await contract.nonces(userAddress)
    .then((res) => Number(res));

  return nonces;
};
