import React from 'react';
import clsx from 'clsx';

import type { GraphType } from '~/routes/api/graph.$chainId.$from.$to.$duration.$type';
import {
  candlestickDurations,
  CandlestickGraphDuration,
} from '~/routes/api/graph.$chainId.$from.$to.$duration.$type';
import {
  seriesDurations,
  SeriesGraphDuration,
} from '~/routes/api/graph.$chainId.$from.$to.$duration.$type';

interface Props {
  changeDuration: (duration: SeriesGraphDuration | CandlestickGraphDuration) => void;
  duration: SeriesGraphDuration | CandlestickGraphDuration;
  graphType: GraphType;
  className?: string;
}

const durationShortName: Record<SeriesGraphDuration | CandlestickGraphDuration, string> = {
  [CandlestickGraphDuration.FIVE_MIN]: '5M',
  [CandlestickGraphDuration.FIVETEEN_MIN]: '15M',
  [CandlestickGraphDuration.HOUR]: '1H',
  [CandlestickGraphDuration.FOUR_HOURS]: '4H',
  [CandlestickGraphDuration.WEEK]: '1W',
  [CandlestickGraphDuration.DAY]: '1D',
  [SeriesGraphDuration.DAY]: '1D',
  [SeriesGraphDuration.WEEK]: '1W',
  [SeriesGraphDuration.MONTH]: '1M',
  [SeriesGraphDuration.SIX_MONTH]: '6M',
  [SeriesGraphDuration.YEAR]: '1Y',
  [SeriesGraphDuration.ALL]: 'All time',
};

export const Durations: React.FC<Props> = React.memo(function Duration({
  duration,
  changeDuration,
  className,
  graphType,
}) {
  const durations = graphType === 'series' ? seriesDurations : candlestickDurations;
  return (
    <div
      className={clsx(
        'rounded border-[1px] border-solid border-black/5 bg-white p-[1px] text-xs leading-tight text-black/50',
        'dark:bg-black dark:text-white/50 dark:border-lightBlack',
        className
      )}
    >
      {durations.map((durationElem) => {
        const shortName = durationShortName[durationElem];

        return (
          <div
            key={durationElem}
            className={clsx(
              'ml-1 whitespace-nowrap rounded p-1 first:ml-0 hover:bg-black/5 hover:text-black',
              'dark:hover:text-white dark:hover:bg-white/5',
              duration === durationElem
                ? 'bg-black/5 text-black dark:bg-white/20 dark:text-white'
                : 'cursor-pointer'
            )}
            onClick={() => {
              changeDuration(durationElem);
            }}
          >
            {shortName}
          </div>
        );
      })}
    </div>
  );
});
