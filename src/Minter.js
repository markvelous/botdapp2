import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./util/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  useEffect(() => async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Create a story and give life to the NFT!");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a href="https://metamask.io/download.html" target="_blank" rel="noopener noreferrer">
            Please install Metamask, a virtual Ethereum wallet, in your browser.</a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { success, status } = await mintNFT(url, name, description);
    setStatus(status);
    if (success) {
      setName("");
      setDescription("");
      setURL("");
    }
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect 🦊 Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">Marköbot 🤖 NFT Minter</h1>
      <p>
        Add your digital asset's link, name and description, <br></br>then press "Mint my Unique Marköbot" to create your NFT
      </p>
      <form>
        <h2>Location of the digital asset (IPFS): </h2>
        <input
          type="text"
          placeholder="Where it is located, e.g. https://gateway.pinata.cloud/ipfs/<hash>/<name.ext>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>Name of the NFT: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>Metadata of the NFT: </h2>
        <input
          type="text"
          placeholder="e.g. Now to sell it to a whale ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
      🔥 Mint my unique NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;
