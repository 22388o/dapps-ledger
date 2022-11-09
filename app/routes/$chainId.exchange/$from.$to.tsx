import { useCallback, useEffect, useMemo, useRef } from "react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { observer } from "mobx-react";
import {
  useAccount,
  useBalance,
  useNetwork,
  useProvider,
  useSigner,
} from "wagmi";
import clsx from "clsx";

import type { Token } from "~/objects/tokens";
import { getTokenBySymbol } from "~/objects/tokens";
import { useRootStore } from "~/store/rootStore";
import { getTokens } from "~/data/tokens";
import { STORAGE_KEYS, useLocalStorage } from "~/hooks/useLocalStorage";
import { useCheckUrl } from "~/hooks/useCheckUrl";
import { isSupportedNetwork, replaceChainIdUrl } from "~/helpers/helpers";
import { Swap } from "~/components/Swap/Swap";
import { type SupportedNetworks, DEFAULT_TOKEN_PAIRS } from "~/constants";

export const loader: LoaderFunction = async ({
  params,
  context: { logger },
  request,
}) => {
  let { from, to, chainId } = params;

  if (!chainId || !isSupportedNetwork(chainId)) {
    return json("Does not have required param CHAIN_ID", { status: 400 });
  }

  if (from === to) {
    from = DEFAULT_TOKEN_PAIRS[chainId][0];
    to = DEFAULT_TOKEN_PAIRS[chainId][1];
  }

  let tokens;

  const canonical = `${chainId}/exchange/${from}/${to}`;

  try {
    tokens = await getTokens(logger, chainId);
  } catch (error) {
    logger.error(`${error}`, {
      response_code: 500,
      request: request.url,
      original_url: request.url,
    });
  }

  return {
    from,
    to,
    tokens,
    canonical,
  };
};

interface PageData {
  from: string;
  to: string;
  tokens: Record<string, Record<string, Token>>;
}

function Index() {
  const navigate = useNavigate();
  const { chainId } = useParams();
  const { appStore, web3Store } = useRootStore();

  const { from, to, tokens } = useLoaderData<PageData>();
  const [customTokens] = useLocalStorage(STORAGE_KEYS.CUSTOM_TOKENS);

  const tokensMap = useMemo(
    () => ({
      ...(chainId && tokens[chainId]),
      ...(chainId && JSON.parse(customTokens ?? "{}")[chainId]),
    }),
    [chainId, tokens, customTokens]
  );

  const getTokenBySymbolMemo = useCallback(
    (symbol) => {
      if (chainId) {
        return getTokenBySymbol(tokensMap)(symbol);
      }
    },
    [chainId, tokensMap]
  );

  const fromToken =
    getTokenBySymbolMemo(from) ??
    getTokenBySymbolMemo(DEFAULT_TOKEN_PAIRS[chainId as SupportedNetworks][0]);

  const toToken =
    getTokenBySymbolMemo(to) ??
    getTokenBySymbolMemo(DEFAULT_TOKEN_PAIRS[chainId as SupportedNetworks][1]);

  useCheckUrl({ fromToken, toToken, chainId });

  useEffect(() => {
    if (fromToken && toToken) {
      appStore.setFromToken(fromToken);
      appStore.setToToken(toToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken?.address, toToken?.address]);

  useEffect(() => {
    if (tokensMap) {
      appStore.setTokens(tokensMap);
    }
  }, [appStore, tokensMap]);

  const { chain } = useNetwork();
  const { address } = useAccount();
  const provider = useProvider({ chainId: chainId ? +chainId : 1 });
  const { data: signer } = useSigner();
  const { data: balance } = useBalance({
    addressOrName: address,
    chainId: +appStore.chainId,
    watch: true,
  });
  const prevNetwork = useRef(chain?.id);

  //init web3Store from wagmi hooks
  useEffect(() => {
    web3Store.setProvider(provider);

    if (signer && address && balance && chain?.id) {
      web3Store.setSigner(signer);
      web3Store.setAccountAddress(address);
      web3Store.setAccountBalance(balance.value);
      web3Store.setProviderChainId(chain.id);
      isSupportedNetwork(`${chain.id}`) &&
        prevNetwork.current !== chain.id &&
        navigate(`/${chain.id}/exchange/${from}/${to}`);
      prevNetwork.current = chain.id;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, signer, address, balance, web3Store, chain?.id, navigate]);

  useEffect(() => {
    if (chainId && isSupportedNetwork(chainId)) {
      appStore.setChainId(chainId);
      web3Store.setProviderChainId(+chainId);
    }
  }, [appStore, chainId, web3Store]);

  useEffect(() => {
    const id = String(chain?.id);
    if (chain?.id && isSupportedNetwork(id)) {
      navigate(replaceChainIdUrl(id)); // For changing tokens after changing chain (only for Ledger live)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain?.id]);

  return (
    <>
      <div
        className={clsx(
          "relative flex flex-col md:flex-row justify-between min-h-[620px]",
          "mt-5"
        )}
      >
        <aside
          className={clsx(
            "z-[2] w-[413px] self-start max-w-[413px] sticky m-auto"
          )}
        >
          <Swap />
        </aside>
      </div>
    </>
  );
}

export default observer(Index);
