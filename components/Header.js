import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useStatus } from "../context/statusContext";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact";

const Header = () => {
  const { setStatus } = useStatus();
  const [walletAddress, setWalletAddress] = useState("");

  // const connectWalletPressed = async () => {
  //   const walletResponse = await connectWallet();
  //   setWalletAddress(walletResponse.address);
  //   setStatus(walletResponse.status);
  // };

  useEffect(() => {
    const fetchData = async () => {
      const walletResponse = await getCurrentWalletConnected();
      setWalletAddress(walletResponse.address);
      setStatus(walletResponse.status);
    };

    fetchData();
    addWalletListener();
  }, []);

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setStatus("");
        } else {
          setWalletAddress("");
          setStatus("🦊 Connect to Metamask using Connect Wallet button.");
        }
      });
    }
  };

  return (
    <>
      <Head>
        <title>Staking</title>
        <meta name="description" content="Staking System" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/fonts/HandbagRegular-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous"></link>
      </Head>

      <header className="sticky inset-x-0 top-0 z-10 h-20 min-w-full text-white border-b border-purple-900 bg-primary backdrop-filter backdrop-blur-lg bg-opacity-30">
        <div className="flex items-center container mx-auto max-w-7xl justify-between h-full">
          {/* Logo */}
          <Link href="#" style={{marginLeft: '15px'}}>
            <a className="text-2xl font-bold">
              ZENO
            </a>
          </Link>

          {/* Navigation */}

          <nav aria-label="Main Menu" style={{marginRight: '10px'}}>
            <ul className="flex items-center space-x-8">

              {walletAddress.length > 0 ? ( 
                <li className="hover:text-purple-500 hover:border-purple-500 cursor-pointer px-4 py-2 font-extrabold text-purple-300 border border-purple-300 rounded-md">
                  <a
                    className=""
                  >
                      {String(walletAddress).substring(0, 6) +
                      "..." +
                      String(walletAddress).substring(38)}
                  </a>
                </li>
                ) : (
                <></>
              )}
            </ul>
          </nav>

    
        </div>
      </header>
    </>
  );
};

export default Header;
