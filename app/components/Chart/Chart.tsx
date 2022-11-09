import { useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { observer } from 'mobx-react';
import { now } from 'mobx-utils';
import { throttle } from 'lodash';
import type { LineData, MouseEventParams } from 'lightweight-charts';

import { GraphData } from '~/components/Chart/GraphData';
import type {
  GraphResponse,
  GraphType,
} from '~/routes/api/graph.$chainId.$from.$to.$duration.$type';
import { CandlestickGraphDuration } from '~/routes/api/graph.$chainId.$from.$to.$duration.$type';
import { SeriesGraphDuration } from '~/routes/api/graph.$chainId.$from.$to.$duration.$type';
import { useRootStore } from '~/store/rootStore';
import { Durations } from '~/components/Chart/Durations';
import { Graph } from './Graph';
import { TokensPair } from './TokensPair';

interface Props {
  className?: string;
}

export const Chart: React.FC<Props> = observer(({ className }) => {
  const fetcher = useFetcher<GraphResponse>();
  const ref = useRef<HTMLDivElement>(null);
  const {
    appStore: { chainId, from, to, toggleDirection },
  } = useRootStore();

  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [graphType, setGraphType] = useState<GraphType>('series');
  const [duration, setDuration] = useState<SeriesGraphDuration | CandlestickGraphDuration>(
    graphType === 'series' ? SeriesGraphDuration.MONTH : CandlestickGraphDuration.HOUR
  );
  const graphData: LineData[] | undefined = fetcher.data?.data as LineData[];

  const toggleDirectionThrottled = useMemo(() => throttle(toggleDirection, 300), [toggleDirection]);

  const onMoveThrottled = useMemo(
    () =>
      throttle((e: MouseEventParams) => {
        if (e.seriesPrices.size > 0) {
          //open = bar, value = series
          setCurrentPrice(
            e.seriesPrices.values().next().value.open
              ? e.seriesPrices.values().next().value.open
              : e.seriesPrices.values().next().value
          );
          return;
        }
        setCurrentPrice(0);
      }, 100),
    []
  );

  useEffect(() => {
    if (from && to) {
      fetcher.load(`/api/graph/${chainId}/${from.address}/${to.address}/${duration}/${graphType}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, from, to, graphType, chainId, now(60000)]);

  return (
    <div ref={ref} className={className}>
      <h5 className="text-[26px] leading-8">Exchange Rates</h5>
      {from && to && (
        <TokensPair
          from={from}
          to={to}
          toggleDirection={toggleDirectionThrottled}
          chainId={chainId}
        />
      )}
      <GraphData
        data={graphData}
        duration={duration}
        currentPrice={currentPrice}
        changeDuration={setDuration}
        graphType={graphType}
        setGraphType={setGraphType}
        isLoading={fetcher.state === 'loading'}
      />
      <Graph
        graphType={graphType}
        onMove={onMoveThrottled}
        duration={duration}
        isLoading={fetcher.state === 'loading'}
        data={fetcher.data?.data}
      />
      <div className="text-center">
        <Durations
          className="mt-10 inline-flex lg:hidden"
          duration={duration}
          changeDuration={setDuration}
          graphType={graphType}
        />
      </div>
    </div>
  );
});
