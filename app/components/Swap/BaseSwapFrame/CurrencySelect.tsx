import { useRef, useState } from "react";
import NumberFormat from "react-number-format";
import type { NumberFormatValues, SourceInfo } from "react-number-format";
import { observer } from "mobx-react";
import clsx from "clsx";

import type { Token } from "~/objects/tokens";
import { ArrowIcon } from "~/components/Icon/ArrowIcon";
import { Skeleton } from "../../Skeleton";
import { Tooltip } from "../../Tooltip";
import { InfoIcon } from "../../Icon/InfoIcon";
import { formatNumber } from "~/helpers/helpers";
import { useWindowSize } from "~/hooks";
import { useUiSettings } from "~/UiProvider";
import { ScreenSize } from "~/constants";
import { TokenImageWithFallback } from "~/components/TokenImageWithFallback";

const TOOLTIP_TEXT =
  "This value is calculated by subtracting the transaction fee from your balance. ";
const BALANCE_LOWER_TEXT =
  "Currently, your balance is lower than the transaction fee.";

interface Props {
  className?: string;
  title: string;
  token: Token | null;
  value: string;
  decimals?: number;
  rate?: string;
  tokenBalance?: {
    balance: string;
    nativeTokenBalanceWithoutTxFee?: string;
  };
  tokenPriceUSD: string;
  best?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onChange?: (values: NumberFormatValues, sourceInfo: SourceInfo) => void;
  openSelectToken: () => void;
  setMaxAmountFrom?: (value: string) => void;
}

export const CurrencySelect: React.FC<Props> = observer(
  ({
    title,
    token,
    decimals,
    rate,
    tokenBalance,
    tokenPriceUSD,
    value,
    best,
    isLoading,
    disabled,
    className,
    onChange,
    openSelectToken,
    setMaxAmountFrom,
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isShowTooltip, setIsShowTooltip] = useState(false);

    const { isLightTheme } = useUiSettings();

    const onSetMaxAmount = () => {
      if (setMaxAmountFrom && tokenBalance?.balance) {
        setIsShowTooltip(true);
        setMaxAmountFrom(
          tokenBalance.nativeTokenBalanceWithoutTxFee
            ? tokenBalance.nativeTokenBalanceWithoutTxFee.replace(" ", "")
            : tokenBalance.balance.replace(" ", "")
        );
      }
    };

    const { width } = useWindowSize();
    const isMobile = width < ScreenSize.md;

    const isSetMaxAmountFrom =
      tokenBalance && parseFloat(tokenBalance.balance) > 0 && setMaxAmountFrom;

    return (
      <div ref={ref} className={className}>
        <div className="mb-2 -mt-7 flex h-6 w-full items-center justify-between">
          <div className={clsx("text-sm text-black/40", "dark:text-white/40")}>
            {title}
          </div>
          {isSetMaxAmountFrom && (
            <div>
              <span
                className={clsx(
                  "mr-2.5 text-sm text-black/40",
                  "dark:text-white/50"
                )}
              >
                Balance: {tokenBalance.balance}
              </span>
              <button
                className={clsx("text-sm text-black", "dark:text-white")}
                onClick={onSetMaxAmount}
              >
                MAX
              </button>
            </div>
          )}
        </div>
        <div
          className={clsx(
            "relative rounded-2xl bg-[#F6F7F8] px-4 py-2.5",
            "dark:bg-[#1A1A1A]"
          )}
        >
          <div className={"mb-2.5 flex items-center justify-between"}>
            <button
              className={clsx(
                "flex cursor-pointer items-center rounded-full py-0.5 pl-0.5 pr-3 transition-colors duration-200",
                "hover:bg-lightGray/80 active:bg-lightGray/80",
                "dark:hover:bg-lightBlack darl:active:bg-lightBlack"
              )}
              onClick={openSelectToken}
            >
              <TokenImageWithFallback token={token} className="mr-2" />
              <span
                className={clsx(
                  "max-w-[100px] overflow-hidden overflow-ellipsis whitespace-nowrap text-black",
                  "dark:text-white"
                )}
              >
                {token?.symbol}
              </span>
              <ArrowIcon
                className={clsx("ml-2 w-3 text-black", "dark:text-white")}
              />
            </button>
            <h2
              className={clsx(
                "ml-2 overflow-hidden text-ellipsis whitespace-nowrap font-sans text-sm text-black/50",
                "dark:text-white/50"
              )}
            >
              {token?.name}
            </h2>
          </div>
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              <div
                className={clsx(
                  "mb-2.5 h-4 text-xs font-light text-[#264168]/40",
                  "dark:text-white/30"
                )}
              >
                {!!rate && rate}
                {tokenPriceUSD !== undefined &&
                  `~ $${formatNumber(tokenPriceUSD)}`}
              </div>
              <div className="flex items-center justify-between">
                <NumberFormat
                  onValueChange={(values, sourceInfo) => {
                    onChange?.(values, sourceInfo);
                    sourceInfo.source === "event" && setIsShowTooltip(false);
                  }}
                  className={clsx(
                    "bg-[#F6F7F8] relative w-full text-xl text-black outline-none font-normal disabled:bg-transparent disabled:opacity-100",
                    "dark:text-white dark:bg-[#1A1A1A]"
                  )}
                  value={value}
                  maxLength={18}
                  decimalSeparator="."
                  displayType="input"
                  type="text"
                  decimalScale={decimals}
                  thousandSeparator={" "}
                  allowLeadingZeros={false}
                  allowNegative={false}
                  disabled={disabled}
                  isNumericString
                  isAllowed={(values) => !/^\.\d+$/.test(values.value)}
                />
                {tokenBalance?.nativeTokenBalanceWithoutTxFee && isShowTooltip && (
                  <Tooltip
                    position={isMobile ? "top" : "right"}
                    offsetX={isMobile ? "left" : undefined}
                    themeColor={isLightTheme ? "white" : "black"}
                    content={
                      <div className="w-60">{`${TOOLTIP_TEXT}${
                        +tokenBalance.nativeTokenBalanceWithoutTxFee > 0
                          ? ""
                          : BALANCE_LOWER_TEXT
                      }`}</div>
                    }
                  >
                    <InfoIcon className="h-4 w-4 cursor-pointer text-gray" />
                  </Tooltip>
                )}
              </div>
            </>
          )}
          {best && (
            <div className="absolute -top-2 -right-1 rounded bg-actionBlue px-2 py-0.5 text-xs text-white">
              Best
            </div>
          )}
        </div>
      </div>
    );
  }
);
