import type { Time } from 'lightweight-charts';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { isSupportedNetwork } from '~/helpers/helpers';

export type GraphType = 'series' | 'candlestick';

export enum SeriesGraphDuration {
  DAY = '24H',
  WEEK = '1W',
  MONTH = '1M',
  SIX_MONTH = '6M',
  YEAR = '1Y',
  ALL = 'AllTime',
}

export enum CandlestickGraphDuration {
  FIVE_MIN = '5m',
  FIVETEEN_MIN = '15m',
  HOUR = '1h',
  FOUR_HOURS = '4h',
  DAY = '24h',
  WEEK = '1w',
}

export const CandleStickDurationSec = {
  [CandlestickGraphDuration.FIVE_MIN]: '300',
  [CandlestickGraphDuration.FIVETEEN_MIN]: '900',
  [CandlestickGraphDuration.HOUR]: '3600',
  [CandlestickGraphDuration.FOUR_HOURS]: '14400',
  [CandlestickGraphDuration.DAY]: '86400',
  [CandlestickGraphDuration.WEEK]: '604800',
};

export type GraphResponse = SeriesResponse | CandlestickResponse;

export interface SeriesResponse {
  data: Array<{
    time: Time;
    value: number;
  }>;
}

export interface CandlestickResponse {
  data: Array<{
    close: number;
    high: number;
    low: number;
    open: number;
    time: Time;
  }>;
}

export const seriesDurations: SeriesGraphDuration[] = [
  SeriesGraphDuration.DAY,
  SeriesGraphDuration.WEEK,
  SeriesGraphDuration.MONTH,
  SeriesGraphDuration.YEAR,
  SeriesGraphDuration.ALL,
];

export const candlestickDurations: CandlestickGraphDuration[] = [
  CandlestickGraphDuration.FIVE_MIN,
  CandlestickGraphDuration.FIVETEEN_MIN,
  CandlestickGraphDuration.HOUR,
  CandlestickGraphDuration.FOUR_HOURS,
  CandlestickGraphDuration.DAY,
  CandlestickGraphDuration.WEEK,
];

// Typeguards
export const isSeriesDuration = (value: string | undefined): value is SeriesGraphDuration => {
  return !!value && seriesDurations.includes(value as SeriesGraphDuration);
};

export const isCandleStickDuration = (
  value: string | undefined
): value is CandlestickGraphDuration => {
  return !!value && candlestickDurations.includes(value as CandlestickGraphDuration);
};

export const isCandlestickData = (
  data: CandlestickResponse['data'] | SeriesResponse['data']
): data is CandlestickResponse['data'] => {
  const dataTmp = data as CandlestickResponse['data'];
  return dataTmp?.length > 0 && dataTmp[0].high !== undefined;
};

export const isSeriesData = (
  data: CandlestickResponse['data'] | SeriesResponse['data']
): data is SeriesResponse['data'] => {
  const dataTmp = data as SeriesResponse['data'];
  return dataTmp?.length > 0 && dataTmp[0].value !== undefined;
};
//end Typeguards

export const loader: LoaderFunction = async ({
  params,
  context: { logger },
  request,
}): Promise<GraphResponse | Response> => {
  const { from, to, chainId, duration, type } = params;

  if (!isSeriesDuration(duration) && !isCandleStickDuration(duration)) {
    return json('Does not have required param DURATION', { status: 400 });
  }

  if (!chainId || !isSupportedNetwork(chainId)) {
    return json('Does not have required param CHAIN_ID', { status: 400 });
  }

  let marketData: GraphResponse = {
    data: [],
  };

  const dataLink =
    type === 'candlestick' && isCandleStickDuration(duration)
      ? `https://charts.1inch.io/v1.0/chart/aggregated/candle/${from?.toLowerCase()}/${to?.toLowerCase()}/${
          CandleStickDurationSec[duration]
        }/${chainId}`
      : `https://charts.1inch.io/v1.0/chart/line/${from?.toLowerCase()}/${to?.toLowerCase()}/${duration}/${chainId}`;

  try {
    const response = await fetch(dataLink);

    if (response.status === 200) {
      logger.info('', {
        response_code: response.status,
        request: dataLink,
        original_url: request.url,
      });
    } else {
      logger.error(response, {
        response_code: response.status,
        request: dataLink,
        original_url: request.url,
      });
    }
    marketData = await response.json();
  } catch (error) {
    logger.error(`${error}`, {
      response_code: 500,
      original_url: request.url,
    });
  }

  return marketData;
};
