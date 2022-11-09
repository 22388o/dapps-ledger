import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';

import { isSupportedNetwork } from '~/helpers/helpers';
import { type Token } from '~/objects/tokens';
import { SupportedNetworks } from '~/constants';
import { DEFAULT_TOKEN_PAIRS } from '~/constants';

interface CheckUrlParams {
  fromToken?: Token;
  toToken?: Token;
  chainId?: string;
}

export const useCheckUrl = ({ fromToken, toToken, chainId }: CheckUrlParams) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isValidChainId = chainId && isSupportedNetwork(chainId);
    const isInvalidFromTo = !fromToken || !toToken || fromToken.symbol === toToken.symbol;

    if (isValidChainId && isInvalidFromTo) {
      return navigate(
        `/${chainId}/exchange/${DEFAULT_TOKEN_PAIRS[
          chainId
        ][0].toLowerCase()}/${DEFAULT_TOKEN_PAIRS[chainId][1].toLowerCase()}`
      );
    }

    if (isValidChainId && !isInvalidFromTo) {
      return navigate(
        `/${chainId}/exchange/${fromToken.symbol?.toLowerCase()}/${toToken.symbol?.toLowerCase()}`
      );
    }

    if (isValidChainId) {
      return navigate(
        `/${chainId}/exchange/${DEFAULT_TOKEN_PAIRS[
          chainId
        ][0].toLowerCase()}/${DEFAULT_TOKEN_PAIRS[chainId][1].toLowerCase()}`
      );
    }

    navigate(
      `/1/exchange/${DEFAULT_TOKEN_PAIRS[
        SupportedNetworks.Ethereum
      ][0].toLowerCase()}/${DEFAULT_TOKEN_PAIRS[SupportedNetworks.Ethereum][1].toLowerCase()}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken?.address, toToken?.address, navigate, chainId]);
};
