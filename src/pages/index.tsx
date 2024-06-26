import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import {
  Address,
  erc20ABI,
  useAccount,
  useChainId,
  useConfig,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import ABI from "../abi.json";
import { formatEther, getAddress, parseEther } from "viem";
export default function Home() {
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
    useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);
  const closeAll = () => {
    setIsNetworkSwitchHighlighted(false);
    setIsConnectHighlighted(false);
  };
  const { address: connectedAddress } = useAccount();
  const chainID = useChainId();
  const { chains } = useNetwork();
  console.log({ chains });

  const myTokenAddress = (
    chainID === 50
      ? process.env.NEXT_PUBLIC_TOKEN
      : process.env.NEXT_PUBLIC_TOKEN_TEST
  ) as Address;

  const { data: balance } = useContractRead({
    abi: ABI,
    address: myTokenAddress,
    functionName: "balanceOf",
    args: [connectedAddress],
    watch: true,
  });

  const { write } = useContractWrite({
    abi: ABI,
    address: myTokenAddress,
    functionName: "mint",
    args: [connectedAddress, parseEther("1")],
  });
  console.log({ chainID });

  return (
    <>
      <Head>
        <title>WalletConnect | Next Starter Template</title>
        <meta name="description" content="Generated by create-wc-dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <div
          className={styles.backdrop}
          style={{
            opacity: isConnectHighlighted || isNetworkSwitchHighlighted ? 1 : 0,
          }}
        />
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image
              src="/logo.svg"
              alt="WalletConnect Logo"
              height="32"
              width="203"
            />
          </div>
          <div className={styles.buttons}>
            <div
              onClick={closeAll}
              className={`${styles.highlight} ${
                isNetworkSwitchHighlighted ? styles.highlightSelected : ``
              }`}
            >
              <w3m-network-button />
            </div>
            <div
              onClick={closeAll}
              className={`${styles.highlight} ${
                isConnectHighlighted ? styles.highlightSelected : ``
              }`}
            >
              <w3m-button />
            </div>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        {connectedAddress && (
          <>
            <div>
              {chains.map(({ rpcUrls,id }) => (
                <>
                  <div>chainID {id}</div>
                  <div>default: {rpcUrls.default.http[0]}</div>
                  <div>public: {rpcUrls.public.http[0]}</div>
                  <div>---</div>
                </>
              ))}
            </div>
            <div>MyToken Contract Address: {myTokenAddress as Address}</div>
            <div>Connected Wallet: {connectedAddress as Address}</div>
            <div>
              MyToken Balance: {balance ? formatEther(balance as bigint) : 0}
            </div>
            <div>
              <div></div>

              <button
                type="submit"
                onClick={async () => {
                  write();
                }}
                className={styles["button-3"]}
              >
                Mint
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
