import React, { useCallback, useRef, useState } from "react";
import { observer } from "mobx-react";
import clsx from "clsx";
import { useAccount, useBalance } from "wagmi";

import { compactAddress, formatNumber } from "~/helpers/helpers";
import { useClickOutside } from "~/hooks/useClickOutside";
import { ArrowIcon } from "~/components/Icon/ArrowIcon";
import { AccountMenu } from "./AccountMenu";
import { NETWORKS } from "~/constants";
import { useRootStore } from "~/store/rootStore";
import { useIsMounted } from "~/hooks";

interface Props {
  className?: string;
}

export const Account: React.FC<Props> = observer(({ className }) => {
  const isMounted = useIsMounted();
  const {
    appStore: { chainId },
  } = useRootStore();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const toggleMenu = useCallback(() => setOpen((isOpen) => !isOpen), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  useClickOutside(ref, closeMenu);

  const { address } = useAccount();
  const { data: balance } = useBalance({
    addressOrName: address,
    chainId: +chainId,
  });

  if (!address || !isMounted) {
    return null;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={clsx(
        "relative flex rounded-2lg p-0.5 text-sm duration-200 bg-cgreen hover:bg-cgreenHover",
        "dark:bg-cgreenDark dark:hover:bg-cgreenDarkHover",
        open && "bg-cgreenHover dark:bg-cgreenDarkHover",
        className
      )}
      ref={ref}
    >
      <div className="whitespace-nowrap py-2 pl-3 pr-2 block text-white">
        {formatNumber(balance?.formatted ?? 0)}{" "}
        {NETWORKS.find((network) => network.id === chainId)?.nativeToken}
      </div>
      <button
        onClick={toggleMenu}
        className={clsx(
          "flex cursor-pointer items-center rounded-lg bg-white py-2 uppercase text-black px-3 tracking-normal",
          "dark:bg-black dark:text-white"
        )}
      >
        {compactAddress(address)}
        <ArrowIcon
          className={clsx(
            "ml-2.5 h-3 w-3 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <AccountMenu chainId={chainId} />}
    </div>
  );
});
