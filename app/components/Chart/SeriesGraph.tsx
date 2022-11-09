import React, { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChartOptions,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LineData,
  MouseEventParams,
} from 'lightweight-charts';

import { getPriceFormatter } from '~/components/Chart/graph.helpers';
import { SeriesGraphDuration } from '~/routes/api/graph.$chainId.$from.$to.$duration.$type';
import { useWindowResize } from '~/hooks';
import { useUiSettings } from '~/UiProvider';

const chartOptions = (isLightTheme: boolean): DeepPartial<ChartOptions> => ({
  layout: {
    backgroundColor: 'transparent',
    textColor: isLightTheme ? '#000' : '#fff',
    fontSize: 12,
    fontFamily: 'Montserrat',
  },
  localization: {
    locale: 'en',
    dateFormat: 'MM/dd/yyyy',
  },
  timeScale: {
    borderVisible: false,
    timeVisible: true,
  },
  rightPriceScale: {
    borderVisible: false,
    drawTicks: false,
  },
  crosshair: {
    vertLine: {
      color: isLightTheme ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
      style: 3,
      labelBackgroundColor: '#dfdfdf',
      width: 1,
    },
    horzLine: {
      color: isLightTheme ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
      style: 3,
      labelBackgroundColor: '#dfdfdf',
      width: 1,
    },
  },
  grid: {
    vertLines: {
      color: isLightTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
    },
    horzLines: {
      visible: false,
    },
  },
  handleScale: false,
  handleScroll: false,
});

interface Props {
  data: LineData[];
  duration: SeriesGraphDuration;
  onMove: (e: MouseEventParams) => void;
  className?: string;
}

export const SeriesGraph: React.FC<Props> = React.memo(function Graph({
  data,
  duration,
  className,
  onMove,
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [chart, setChart] = useState<IChartApi | null>(null);
  const [series, setSeries] = useState<ISeriesApi<'Line'> | null>(null);

  const { isLightTheme } = useUiSettings();

  const onResize = useCallback(() => {
    if (chart && ref.current) {
      chart.applyOptions({ width: ref.current.offsetWidth });
      chart.timeScale().fitContent();
    }
  }, [chart, ref]);

  useWindowResize(onResize);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      import('lightweight-charts').then(({ createChart }) => {
        setChart(createChart(element, chartOptions(isLightTheme)));
      });
    }
  }, [ref, isLightTheme]);

  useEffect(() => {
    if (chart) {
      const series = chart.addLineSeries({
        color: isLightTheme ? '#000' : '#fff',
        priceLineVisible: false,
        lineWidth: 1,
      });

      setSeries(series);
    }
  }, [chart, isLightTheme]);

  useEffect(() => {
    if (series && chart && data) {
      series.applyOptions({
        priceFormat: getPriceFormatter(data),
      });
      series.setData(data);
      chart.timeScale().fitContent();
      chart.timeScale().applyOptions({
        timeVisible: duration === SeriesGraphDuration.DAY,
      });
      chart.subscribeCrosshairMove(onMove);
    }
  }, [series, chart, duration, data, onMove]);

  useEffect(() => {
    if (chart) {
      return () => chart?.remove();
    }
  }, [chart]);

  return (
    <div className={className}>
      <div ref={ref} className="absolute inset-0 z-[1]" />
    </div>
  );
});
