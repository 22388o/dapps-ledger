import { useParams, useLocation, useNavigate } from "@remix-run/react";
import { observer } from "mobx-react";
import { useAccount } from "wagmi";
import clsx from "clsx";

import { Button } from "~/components/Button";
import { Logo } from "~/components/Logo";
import { useRootStore } from "~/store/rootStore";
import { ModalType } from "~/store/ModalStore";
import { Account } from "~/components/Account";
import { UISettings } from "~/components/UISettings";
import { STORAGE_KEYS, useLocalStorage } from "~/hooks";
import { redirectToHome } from "./helpers";

export const Header: React.FC = observer(() => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const isMainPage = params.from && params.to;
  const isApiPage = location.pathname === "/api";
  const isHomePage = location.pathname === "/";

  const { modalStore } = useRootStore();

  const { isConnected } = useAccount();

  const [settings] = useLocalStorage(STORAGE_KEYS.SETTINGS);

  return (
    <header
      className={clsx(
        "sticky top-0 z-[5] backdrop-blur-[2px] md:backdrop-blur-sm md:bg-white/20 dark:bg-black/20",
        isApiPage && "md:mix-blend-darken"
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-2.5 sm:px-11">
        <div className="flex w-full items-center justify-between md:w-auto ">
          <Logo />
        </div>
        <div className={clsx("flex items-center", isHomePage && "!hidden")}>
          {isMainPage ? (
            <>
              {isConnected ? (
                <Account />
              ) : (
                <Button
                  onClick={() =>
                    modalStore.openModal({
                      type: ModalType.SelectWallet,
                      name: "Connect Wallet",
                      position: "right",
                      styles: { container: "h-[calc(100%-40px)] w-[690px]" },
                    })
                  }
                >
                  Connect a Wallet
                </Button>
              )}
            </>
          ) : (
            <button
              onClick={() => {
                redirectToHome(navigate, settings);
              }}
            >
              <Button>Launch App</Button>
            </button>
          )}
          <UISettings />
        </div>
      </div>
    </header>
  );
});
