/**
 * Need help in designing the given 2 buttons
 * 2 buttons:
 *  - Connect wallet
 *  - Query from chain
 */
import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

function App() {
  const [wallet, setWallet] = useState();
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();
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
      // To be implemented by me
      // get contract
      // call the contract function
    }
  };

  return (
    <div className="App">
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>{wallet}</p>
      <button onClick={contractCall}>Call Contract</button>
    </div>
  );
}

export default App;
