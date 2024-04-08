import "@/styles/globals.css";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig, WagmiConfigProps } from "wagmi";
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
import { DefaultConfig } from "abitype";
import { Config } from "@wagmi/core";
import { QueryClient } from "@tanstack/query-core";

const xdcPrefixChains = [
  xdc,
  {
    ...xdcTestnet,
    rpcUrls: {
      default: { http: ["https://rpc.apothem.network"] },
      public: { http: ["https://rpc.apothem.network	"] },
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

const zeroXPrefixConfig = defaultWagmiConfig({
  chains: zeroXchains,
  projectId,
  metadata,
});
export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);
  const [isXdcPrefix, setIsXdcPrefix] = useState(false);
  const [configState, setConfigState] = useState<
    Config<any, any> & {
      queryClient: QueryClient;
    }
  >();
  useEffect(() => {
    setReady(true);
  }, []);
  useEffect(() => {
    if (isXdcPrefix) {
      const xdcPrefixConfig = defaultWagmiConfig({
        chains: xdcPrefixChains,
        projectId,
        metadata,
      });
      createWeb3Modal({
        projectId,
        chains: xdcPrefixChains,
        wagmiConfig: xdcPrefixConfig,
      });
      setConfigState(xdcPrefixConfig);
    } else {
      const zeroXPrefixConfig = defaultWagmiConfig({
        chains: zeroXchains,
        projectId,
        metadata,
      });
      createWeb3Modal({
        projectId,
        chains: xdcPrefixChains,
        wagmiConfig: zeroXPrefixConfig,
      });
      setConfigState(zeroXPrefixConfig);
    }
  }, [isXdcPrefix]);
  return (
    <>
      {ready && configState ? (
        <WagmiConfig config={configState}>
          <div className="checkbox-wrapper-1">
            <input
              id="example-1"
              className="substituted"
              type="checkbox"
              aria-hidden="true"
              checked={isXdcPrefix}
              onChange={() => setIsXdcPrefix((prev) => !prev)}
            />
            <label htmlFor="example-1"> Enable XDC prefix</label>
          </div>

          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}
    </>
  );
}
