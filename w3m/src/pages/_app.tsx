import "@/styles/globals.css";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import {
  arbitrum,
  avalanche,
  bsc,
  fantom,
  gnosis,
  mainnet,
  optimism,
  polygon,
  xdc,
  xdcTestnet,
} from "wagmi/chains";
import { defineChain } from "viem";

const xdcPrefixChains = [
  xdc,
  {
    ...xdcTestnet,
    rpcUrls: {
      default: { http: ["https://erpc.apothem.network"] },
      public: { http: ["https://erpc.apothem.network	"] },
    },
  },
];

const zeroXchains = [
  defineChain({
    ...xdc,
    rpcUrls: {
      default: { http: ["https://erpc.xinfin.network"] },
      public: { http: ["https://erpc.xinfin.network	"] },
    },
  }),
  xdcTestnet,
];

// 1. Get projectID at https://cloud.walletconnect.com

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const metadata = {
  name: "Next Starter Template",
  description: "A Next.js starter template with Web3Modal v3 + Wagmi",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({
  chains: zeroXchains,
  projectId,
  metadata,
});

createWeb3Modal({ wagmiConfig, projectId, chains: zeroXchains });

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}
    </>
  );
}
