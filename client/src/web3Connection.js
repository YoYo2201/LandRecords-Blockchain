import Web3 from 'web3';
import { ethers } from "ethers";

const networks = {
    polygon: {
      chainId: `0x${Number(80001).toString(16)}`,
      chainName: "Mumbai",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
      blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    },
  };

const web3Connection = async () => {
    
    // console.log("Hello")
    await window.ethereum.enable();
    await window.ethereum.request({ method: "eth_requestAccounts" });
    // console.log("Hello1")
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const provider = ((window.ethereum != null) ? new Web3(window.ethereum): undefined)
    // const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum): ethers.providers.getDefaultProvider())
    // console.log("Hello2")
    if (provider.network !== "matic") {
      const accounts = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networks["polygon"],
          },
        ],
      });
    } 
    // console.log("Hello3")
      return provider;
}

export default web3Connection;