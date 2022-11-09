import { useMemo } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  ScrollRestoration,
  useLocation,
  useParams,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { StructuredData } from "remix-utils/build/react/structured-data";
import { observer } from "mobx-react";
import { ToastContainer } from "react-toastify";
import clsx from "clsx";
import { WagmiConfig } from "wagmi";

import reactToastifyStyles from "react-toastify/dist/ReactToastify.css";
import globalStyles from "~/styles.css";

import { RootStore, StoreProvider } from "~/store/rootStore";
import { ModalWatcher } from "~/components/Modal/ModalWatcher";
import { Page } from "~/Layouts/Page";
import { STORAGE_KEYS, useLocalStorage } from "~/hooks/useLocalStorage";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";
import { CloseTooltip } from "./components/Icon/CloseTooltip";
import {
  UiProvider,
  ThemeHead,
  getUiSession,
  useUiSettings,
} from "./UiProvider";
import { useClientWallet } from "./useClientWallet";
import {
  SwapStateProvider,
  useSwapReducer,
} from "./components/Swap/useSwapState";
import { usePrevLocation, OnlineStatusProvider } from "./hooks";
import type { MODE_TYPES, THEME_TYPES } from "./constants";
import type { InitialState } from "~/store/rootStore";

//  https://remix.run/docs/en/v1/api/conventions#links
export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: globalStyles },
    { rel: "stylesheet", href: reactToastifyStyles },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Quattrocento+Sans:wght@700&display=swap",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    { rel: "manifest", href: "/site.webmanifest" },
  ];
};

interface LoaderResult {
  ENV: {
    CHAIN_ID?: string;
    SENTRY_DSN?: string;
    TODAY_TIME?: string;
  };
  theme: THEME_TYPES | null;
  mode: MODE_TYPES | null;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderResult> => {
  const uiSession = await getUiSession(request);

  const today = new Date().toISOString();

  process.env.TODAY_TIME = today;

  return {
    ENV: {
      SENTRY_DSN: process.env.SENTRY_DSN,
      TODAY_TIME: today,
    },
    theme: uiSession.getTheme(),
    mode: uiSession.getMode(),
  };
};

const Body = observer(() => {
  return (
    <Page>
      <Outlet />
      <ModalWatcher />
      <ToastContainer
        autoClose={5000}
        hideProgressBar
        newestOnTop
        className={"!top-20 !right-4 !w-auto"}
        toastClassName={
          "!bg-transparent !shadow-none !mb-0 !justify-end text-black"
        }
        bodyClassName={
          "bg-white rounded-[10px] !text-xs md:!text-sm !text-black !shadow-sm !p-3 !flex-none !font-sans border border-black/5"
        }
        closeButton={({ closeToast }) => (
          <CloseTooltip
            closeToast={closeToast}
            className={"!absolute !top-0 !right-0"}
          />
        )}
        theme={"colored"}
      />
    </Page>
  );
});

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Something went wrong</title>
        <Meta />
        <Links />
      </head>
      <body className="font-medium">
        <ErrorPage error={error} />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  const { ENV, theme: ssrTheme } = useLoaderData();

  const { from, to } = useParams();

  const client = useClientWallet();

  const location = useLocation();

  const prevLocation = usePrevLocation(location);

  const {
    isLightTheme,
    state: { theme },
  } = useUiSettings();

  const isMainPage = from && to;
  const mode = isMainPage && !isLightTheme ? "dark" : "light";

  const isChangeTokens =
    isMainPage && prevLocation?.params?.from && prevLocation?.params?.to;

  return (
    <html
      lang="en"
      className={clsx("h-full scroll-smooth", !!theme && mode)}
      style={{ fontSize: "16px" }}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <ThemeHead ssrTheme={!!ssrTheme} />
        <Meta />
        <Links />
        <StructuredData />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body
        className={clsx(
          "flex flex-col bg-white font-medium text-black overflow-auto",
          "dark:bg-dark dark:text-white"
        )}
      >
        <WagmiConfig client={client}>
          <Body />
        </WagmiConfig>

        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        {!isChangeTokens && <ScrollRestoration />}
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload port={8002} />}
      </body>
    </html>
  );
}

const AppWithProviders: React.FC<InitialState> = observer(() => {
  const { theme, mode } = useLoaderData();
  const [state, actions] = useSwapReducer();

  const [settings] = useLocalStorage(STORAGE_KEYS.SETTINGS);
  const [fromAmount] = useLocalStorage(STORAGE_KEYS.FROM_AMOUNT);

  const store = useMemo(
    () =>
      new RootStore({
        ...(settings && JSON.parse(settings)),
        fromAmount: fromAmount ? fromAmount : undefined,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <StoreProvider value={store}>
      <UiProvider specifiedTheme={theme} specifiedMode={mode}>
        <SwapStateProvider value={{ state, actions }}>
          <OnlineStatusProvider>
            <App />
          </OnlineStatusProvider>
        </SwapStateProvider>
      </UiProvider>
    </StoreProvider>
  );
});

export default AppWithProviders;
