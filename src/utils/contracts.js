/**
 * Instantiate contracts
 */
import { ethers } from "ethers";
import abi from "./voteRouter.json";

const contractAddress = "0x53ddc3544FddF53B718E13Cb05F9b7c88c160818";

export const fetchContract = async (signer) => {
  return new ethers.Contract(contractAddress, abi, signer);
};