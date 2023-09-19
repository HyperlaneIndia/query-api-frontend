# Interchain Query Frontend

Hello developers! Welcome onboard to becoming a pioneer in the Interchain Highway via Hyperlane. In this blog you will be building a simple webapp to integrate to a contract that has Hyperlane integrated to it. We will be using the contract in the [previous blog](https://www.notion.so/Query-API-beeb74e37f624d749c40e712ff67b75f?pvs=21) which does interchain query, letting your contract on a remote chain do a query onto another contract on another remote chain all powered under the hood of Hyperlane.

Lets get started!

I will be attaching the link to repository in the [end of the blog post.](https://www.notion.so/Interchain-Query-Frontend-822ca8e9a1da4d149e92492383a043b9?pvs=21)

We will be walk through in the following series:

- [Setup](https://www.notion.so/Interchain-Query-Frontend-822ca8e9a1da4d149e92492383a043b9?pvs=21)
- [Connect Wallet](https://www.notion.so/Interchain-Query-Frontend-822ca8e9a1da4d149e92492383a043b9?pvs=21)
- [Contracts](https://www.notion.so/Interchain-Query-Frontend-822ca8e9a1da4d149e92492383a043b9?pvs=21)
- [Call Contract](https://www.notion.so/Interchain-Query-Frontend-822ca8e9a1da4d149e92492383a043b9?pvs=21)

## Setup:

We have setup a basic react app on [Replit](https://replit.com/@shreyaspadmakir/interchain-messages). You can fork this repository and start working with it. It is a simple create-react-app command implemented application.

Replit Instance : [https://replit.com/@shreyaspadmakir/interchain-messages](https://replit.com/@shreyaspadmakir/interchain-messages)

(If you are using Replit, you can skip till [here](https://www.notion.so/Interchain-Query-Frontend-822ca8e9a1da4d149e92492383a043b9?pvs=21))

So if you don’t want to use the replit then open the terminal in the desired directory for your frontend application and enter the following command (hoping you have npm installed, else install npm and then continue)

```bash
npx create-react-app messaging-api-frontend
```

If you are using through the above command and not the [replit](https://replit.com/@shreyaspadmakir/interchain-messages) instance, then I would recommend to navigate to the `./src` folder and open the `App.js` file. Inside the `App.js` file, in the return section, remove all of the JSX except the div with className as “App”.

![Untitled](Interchain%20Query%20Frontend%20822ca8e9a1da4d149e92492383a043b9/Untitled.png)

## Connect Wallet:

Now that our application is ready to be set up, lets start building the following components:

- Connect Wallet button : we need a signer to sign the transaction right.
- Button to call the contract on a remote chain which will in turn fetch the votes from another remote chain

Since we have an idea of what we are building with the components lets get started with the functionality.

Initially, lets install ethers library using the following command:

```bash
npm i ethers
```

We use ethers library to interact with contracts.

The first step is to get the user to connect his wallet to our webapp/frontend.

So, lets create a button. Inside the div as follows:

```html
<div className="App">
	<button>Connect Wallet</button>
</div>
```

If you wish to see your app changes, for:

Ones using Replit, just press the Run button.

Ones using local setup, run the following command:

```bash
npm run start
```

You can see a button in the top middle of the screen.

Lets add some functionality to it so that it pops up a wallet and return the account address as well as the provider. We need the provider as it contains the signer object.

Lets add the following piece of code to our codebase. In the `App.js` :

```jsx
import { useState } from "react";
import { ethers } from "ethers";

function App(){
	const [wallet, setWallet] = useState();
  const [provider, setProvider] = useState();
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
return(
	<div className="App">
		<button onClick={connectWallet}>Connect Wallet</button>
	</div>
);
}

export default App;
```

Add the code accordingly or just copy paste your `App.js` file with above code.

Here we using useState hook, to set wallet address, and to set the provider.

In the connectWallet function, we are checking for a object destructuring named as ethereum from the window library. Usually EVM wallets are named as ethereum and the most common one, Metamask pops up for the same. If you want to use any other wallet, recommend to use a wallet hook from walletConnect SDK.

Now if we there is an ethereum object or a wallet available, then it pops up whenever a button is clicked and then asks for permission to grant the user details to the webapp. If you press connect, then your webapp will have access to account address as well as the provider.

And here, since we have our Router contract deployed on Mumbai, we will be telling the user to shift to Mumbai network if he is not connected to the Mumbai network. We do this by checking the `provider.getNetwork()` method and comparing the chain ID retrieved. Once we have the chain changed, we will be setting the new Provider through which we will be retrieving the signer object.

Once you have added this piece of code, just try to hit the button as you will see a wallet pop up and if no wallet exists, then, it will throw an alert as ”Get Metamask!”

And finally lets get the signer object from the provider. Lets write a simple function after connectWallet(). Add this piece of code under connectWallet() function.

```jsx
const getSigner = async () => {
    const signer = await provider.getSigner();
    return signer;
  };
```

This above piece of code will return the signer object which will be needed later.

## Contracts:

Now, lets construct the contracts.

Inside your `./src` directory, create a folder named `./utils` . Under `./utils` create a 2 files named `contracts.js` and `voteRouter.json` .

`contracts.js` file will have the Router contract instantiations.

`voteRouter.json` will have the ABI of router contract.

You can find the ABI by copy pasting the [contract](https://github.com/HyperlaneIndia/Query-API/blob/main/src/VoteRouter.sol) into remix → Compile → Copy ABI and then paste it into respective JSON files. It will usually be an array object.

Now lets deep dive to creating contract connections.

Inside `contracts.js` add the following piece of code:

```jsx
/**
 * Instantiate contracts
 */
import { ethers } from "ethers";
import abi from "./voteRouter.json";

const contractAddress = "0x53ddc3544FddF53B718E13Cb05F9b7c88c160818";

export const fetchContract = async (signer) => {
  return new ethers.Contract(contractAddress, abi, signer);
};
```

You can change the address as per your deployment addresses.

Now there is 1 function which take the signer as an argument and return a Contract interface. The ethers.Contract takes in 3 arguments, the address of the contract, ABI of the contract, signer instance. The signer argument will be passed during the function call which we will see down the line.

Now that we have the **provider**, **contracts** ready, lets start calling the contract from our main file i.e. `App.js` .

Lets import our `contracts.js` into our `App.js` file. We will include import statement in the top of the file under the import statements.

```jsx
import { fetchContract } from "./utils/contracts";
```

## Sign Transaction:

Let us add a button in the return statement under the Connect Wallet button.

```jsx
<button onClick={contractCall}>Call Contract</button>
```

Now lets define our onClick function i.e. `contractCall` . It will be placed under the getSigner() and above the return statement. It includes:

```jsx
const contractCall = async () => {
    if (provider !== null) {
      const proposalId = 1; // Instead add a JSX element to take user input and handle the state using useState Hook
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
    }else{
      alert("Connect wallet first");
    }
  };
```

We will be checking if a provider exists and if it does, then we will get the signer object from the provider. We then get the contract by passing out signer object into the `fetchContract` function.

Once the contract is returned, we call the `fetchVotes` function with the proposal ID to which you need to know the votes for. I have hard coded a proposal ID here, for an extra mile, you can add an input tag and query for the given value. The most important thing to remember is that, we need to call with **a value parameter of 0.01 ethers as a interchain gas fee.** Then we console log the result, instead you can do state handling if needed to be stored.

## Conclusion:

Hence, with this simple frontend and implementation you can design a webapp that will deal with contracts that have Hyperlane integration to them. As I told in the beginning, the change in building an application from a normal application to that which has implemented Hyperlane is  simple with just adding a value parameter to the function that will fetch data from another contract on a remote chain via Hyperlane.

Here is a reference to the finished repository with classic CSS added. The functionality however remains same.

[https://github.com/HyperlaneIndia/query-api-frontend](https://github.com/HyperlaneIndia/query-api-frontend)

Happy Buidling!