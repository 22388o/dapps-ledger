import { observer } from "mobx-react";
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from "wagmi";

import { Button } from "~/components/Button";
import { useRootStore } from "~/store/rootStore";
import { ModalType } from "~/store/ModalStore";
import { InfoIcon } from "~/components/Icon/InfoIcon";
import { Tooltip } from "~/components/Tooltip";
import { useWindowSize, useIsMounted } from "~/hooks";
import { ScreenSize, WalletId } from "~/constants";
import { Loader } from "~/components/Loader";
import { useUiSettings } from "~/UiProvider";

interface Props {
  validNetwork: boolean;
}

export const SwapButton: React.FC<Props> = observer(({ validNetwork }) => {
  const isMounted = useIsMounted();
  const rs = useRootStore();
  const { width } = useWindowSize();
  const { modalStore, appStore, swapStore } = rs;
  const { from } = appStore;
  const { isLightTheme } = useUiSettings();

  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { data: balance } = useBalance({ addressOrName: address });
  const { chain } = useNetwork();
  const { connector: activeConnector } = useAccount();

  const isMetaMaskConnect = activeConnector?.id == WalletId.MetaMask;

  if (!isMounted) {
    return null;
  }

  if (appStore.isSwapParamsLoading || swapStore.isCheckingApprove) {
    return (
      <Button className="w-full">
        <Loader color="#fff" />
      </Button>
    );
  }

  if (swapStore.isApproveLoading) {
    return (
      <Button buttonType="action" className="w-full">
        <Loader color="#fff" />
      </Button>
    );
  }

  if (!address) {
    return (
      <Button
        onClick={() =>
          modalStore.openModal({
            type: ModalType.SelectWallet,
            name: "Connect Wallet",
            position: "right",
            styles: { container: "h-[calc(100%-40px)] w-[690px]" },
          })
        }
        className="hidden w-full md:block"
      >
        Connect Wallet
      </Button>
    );
  }

  if (!validNetwork && isMetaMaskConnect) {
    return (
      <Button
        onClick={() => {
          switchNetwork?.(+appStore.chainId);
        }}
        className="w-full"
      >
        Change Network
      </Button>
    );
  }

  if (!Number(appStore.fromValue)) {
    return (
      <Button className="w-full" disabled>
        Enter an amount
      </Button>
    );
  }

  if (swapStore?.isApproved) {
    return (
      <Button
        disabled={!swapStore.canBeSwapped}
        className="w-full"
        onClick={swapStore?.swap}
      >
        {swapStore?.pending ? <Loader color="#fff" /> : "Swap"}
      </Button>
    );
  }

  const isMobile = width < ScreenSize.md;

  const isDisabledAllowToUse =
    chain?.id !== +appStore.chainId ||
    !balance?.value?.gt(swapStore?.transactionNativeTokenPrice || 0);

  return (
    <Button
      buttonType="action"
      className="w-full"
      onClick={swapStore?.approve}
      disabled={isDisabledAllowToUse}
    >
      {swapStore?.pending ? (
        <Loader color="#fff" />
      ) : (
        <span className="flex items-center justify-center">
          {`Allow to use ${from?.symbol}`}
          <Tooltip
            position={isMobile ? "top" : "bottom"}
            offsetX={isMobile ? "left" : undefined}
            content={
              <div className="w-60">
                To complete a swap, you must allow the smart contract to use
                tokens. This is done once per token.
              </div>
            }
            themeColor={isLightTheme ? "white" : "black"}
            className="ml-2"
          >
            <InfoIcon className="h-4 w-4" />
          </Tooltip>
        </span>
      )}
    </Button>
  );
});
