import { observer } from "mobx-react";
import clsx from "clsx";
import { useNetwork } from "wagmi";

import { OpposedTokens } from "./OpposedTokens";
import { useRootStore } from "~/store/rootStore";
import { type SwapDataResult } from "../useSwapData";
import { SettingsIcon } from "~/components/Icon/SettingsIcon";

interface Props {
  openSettings: () => void;
  openSelectToken: (isFromToken: boolean) => void;
  swapData: SwapDataResult;
}

export const BaseSwapFrame: React.FC<Props> = observer(
  ({ openSettings, openSelectToken, swapData }) => {
    const { appStore, swapStore } = useRootStore();

    const {
      tokenBalance,
      tokenFromPriceUSD,
      tokenToPriceUSD,
      isLoadingSwapParams,
    } = swapData;

    const network = useNetwork();

    const isValidNetwork = appStore.chainId === `${network.chain?.id}`;

    return (
      <>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <h5
              className={clsx(
                "text-[26px] leading-8 text-black",
                "dark:text-white"
              )}
            >
              Swap
            </h5>
          </div>
          <SettingsIcon
            onClick={openSettings}
            className={clsx(
              "h-[14px] w-[14px] cursor-pointer transition-colors duration-300 text-black hover:fill-graySecondary",
              "dark:text-white"
            )}
          />
        </div>

        <OpposedTokens
          validNetwork={isValidNetwork}
          tokenBalance={tokenBalance}
          tokenFromPriceUSD={tokenFromPriceUSD}
          tokenToPriceUSD={tokenToPriceUSD}
          isLoadingSwapParams={isLoadingSwapParams}
          openSelectToken={openSelectToken}
        />

        <div className="text-left text-xs font-light text-[#D82423]">
          {swapStore?.errorString || "\u00A0"}
        </div>
      </>
    );
  }
);
