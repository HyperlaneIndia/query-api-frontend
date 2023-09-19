/**
 * Need help in designing the given 2 buttons
 * 2 buttons:
 *  - Connect wallet
 *  - Query from chain
 */
import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { fetchContract } from "./utils/contracts";

function App() {
  const [wallet, setWallet] = useState();
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();
  const [proposalId, setProposalId] = useState(1);
  /**
   * Function to connect the wallet
   * When the wallet is connected, the wallet address is set to the state along with provider
   */
  const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get metamask!");
    }
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then(async (accounts) => {
        setWallet(accounts[0]);
        let newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
        console.log(await newProvider.getNetwork());
        if ((await newProvider.getNetwork()).chainId !== 80001n) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13881" }],
          });
          setProvider(new ethers.BrowserProvider(window.ethereum));
        }
      });
  };

  /**
   *
   * @returns signer
   * Returns the signer for the provider which will be used to call the metamask to sign transactions
   */

  const getSigner = async () => {
    const signer = await provider.getSigner();
    return signer;
  };

  const contractCall = async () => {
    if (provider !== null) {
      const signer = await getSigner();
      const getContract = await fetchContract(signer);
      await getContract
        .fetchVotes(proposalId, { value: ethers.parseEther("0.01") })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          alert("Insufficient balance");
        });
    } else {
      alert("Connect wallet first");
    }
  };

  return (
    <div classNameName="App">
      <div className="grid px-4 py-24 h-screen bg-blue-900 sm:px-6 lg:px-8 place-items-center">
        <div className="relative w-full max-w-xl mx-auto overflow-hidden bg-white rounded-xl">
          <div className="p-6 sm:p-8">
            <div className="mt-0 space-y-6 sm:mt-1">
              <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-1">
                <div className="overflow-hidden transition-all duration-200 bg-white border border-gray-900 cursor-pointer rounded-xl hover:bg-gray-50">
                  {wallet ? (
                    <div className="px-4 py-5">
                      <p className=" text-sm font-bold text-gray-900">
                        {wallet}
                      </p>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>

              <button
                onClick={connectWallet}
                type="button"
                className="inline-flex items-center justify-center w-full px-6 py-4 text-xs font-bold tracking-widest text-white uppercase transition-all duration-200 bg-gray-900 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-700"
              >
                Connect Wallet
              </button>
              <button
                onClick={contractCall}
                type="button"
                className="inline-flex items-center justify-center w-full px-6 py-4 text-xs font-bold tracking-widest text-white uppercase transition-all duration-200 bg-green-900 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-900 hover:bg-green-700"
              >
                Call Contract
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
