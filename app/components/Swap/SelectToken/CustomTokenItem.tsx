import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Button } from '~/components/Button';
import { isAddress } from 'ethers/lib/utils';

import { useRootStore } from '~/store/rootStore';
import { type Token } from '~/objects/tokens';
import { ERC20__factory } from '~/types/ethers';
import { Loader } from '~/components/Loader';
import { TokenImageWithFallback } from '~/components/TokenImageWithFallback';

interface Props {
  address: string;
  openCustomConfirmation: (token: Token) => void;
}

export const CustomTokenItem: React.FC<Props> = observer(({ address, openCustomConfirmation }) => {
  const {
    web3Store,
    appStore: { chainId },
  } = useRootStore();

  const [token, setToken] = useState<Token | null>(null);
  const [error, setError] = useState(false);

  const getTokenFromAddress = useCallback(async () => {
    if (!web3Store.provider) {
      return;
    }

    try {
      const isContractExist = await !!web3Store.provider.getCode(address);

      if (isContractExist) {
        const contract = ERC20__factory.connect(address, web3Store.provider);

        setToken({
          chainId,
          address,
          name: await contract.name(),
          symbol: await contract.symbol(),
          decimals: await contract.decimals(),
          logoURI: '/images/noLogoTokenIcon.png',
        });
      }
    } catch (error) {
      setError(true);
    }
  }, [address, chainId, web3Store.provider]);

  const openCustomWarning = () => {
    if (token) {
      openCustomConfirmation(token);
    }
  };

  useEffect(() => {
    if (isAddress(address)) {
      setToken(null);
      setError(false);
      getTokenFromAddress();
      return;
    }
    setError(true);
  }, [address, getTokenFromAddress]);

  if (!address) {
    return null;
  }

  if (error) {
    return (
      <div className="mt-20 text-center text-2xl text-black/60 dark:text-white/60">
        Nothing found
      </div>
    );
  }

  if (!token) {
    return <Loader />;
  }

  return (
    <div className="flex justify-between py-1.5 text-sm tracking-wide">
      <div className="flex items-center">
        <TokenImageWithFallback token={token} className="mr-2" />
        <div>{token.symbol}</div>
      </div>
      <Button variant="outline" onClick={openCustomWarning}>
        Import
      </Button>
    </div>
  );
});
