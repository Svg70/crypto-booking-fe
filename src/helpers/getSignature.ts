import { ethers } from "ethers";

export const getSignature = async (
  userAddress: string,
  typedData:  any
) => {
  const provider = new ethers.JsonRpcProvider(
    process.env.REACT_APP_RPC_URL
  );
  const signer = provider.getSigner(userAddress);
  //@ts-ignore
  const signature = await signer._signTypedData(typedData.domain, typedData.types, JSON.stringify(typedData.message));

  return signature
};
