import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect,useState} from "react";

import {ethers} from "ethers";
import myEpicNft from "../utils/MyEpicNFT.json";





export default function Home() {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfMetamaskExists = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }


  }

  async function connectWallet(){

    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error);
    }

  }

  async function mintNFT(){
    const CONTRACT_ADDRESS = "0xf625a82e788B994A475b3992Ad62790F6BEE42F7";

    try{

      const {ethereum} = window;
      if(ethereum){

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS,myEpicNft.abi,signer)

        let nftTxn = await connectedContract.makeAnEpicNFT();
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

    

      }
      else{
        alert("get metamask");
      }


    }
    catch(err){
      console.log(err);
    }
  }

  function content(){

    if(currentAccount===""){
      return showConnectWallet()
    }
    else{
      return(
      <div>
        <h1>You are connected with {currentAccount}</h1>
        <button onClick={mintNFT}>
          Mint NFT
        </button>
       
      </div>
      );
    }

  }

  const showConnectWallet = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfMetamaskExists();
  }, [])

  return (
    <div className={styles.container}>
      <h1>Mint these NFTs</h1>
      
      {content()}
      
    </div>
  )
}
