import baseTestnet from "../../src/baseTestnet.tokens.json";
import mainnet from "../../src/mainnet.tokens.json";
import { TokenInfo } from "@uniswap/token-lists";

type IRawToken = Pick<TokenInfo, "address" | "name" | "symbol"> &
  Partial<Pick<TokenInfo, "logoURI" | "decimals">> & {
    isExperimental?: boolean;
    logoFile?: string;
  };

type IRawTokenListJson = readonly IRawToken[];

export const CELO_NETWORK_NAMES = ["baseTestnet"] as const;
export type ICeloNetwork = typeof CELO_NETWORK_NAMES[number];

// assert the JSON is valid
const rawTokensJson: {
  [network in ICeloNetwork]: [number, IRawTokenListJson];
} = {
  baseTestnet: [84531, baseTestnet],
};

export const getNetworkTokens = (network: ICeloNetwork): IRawTokenListJson =>
  rawTokensJson[network][1];

export const rawTokens: readonly (IRawToken & {
  chainId: number;
})[] = Object.values(rawTokensJson).flatMap(([chainId, tokens]) =>
  tokens.map((tok) => ({ ...tok, chainId }))
);
