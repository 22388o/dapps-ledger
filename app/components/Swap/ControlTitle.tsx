import clsx from 'clsx';
import styled from 'styled-components';
import { useUiSettings } from '~/UiProvider';

import { InfoIcon } from '../Icon/InfoIcon';
import type { TooltipOffsetX } from '../Tooltip';
import { Tooltip } from '../Tooltip';

interface Props {
  children: React.ReactNode;
  tooltipText: string;
  offsetTooltip?: TooltipOffsetX;
  position?: 'right' | 'top';
}

const StyledTooltip = styled(Tooltip)`
  filter: drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.25));
`;

export function ControlTitle({ children, tooltipText, offsetTooltip, position = 'top' }: Props) {
  const { isLightTheme } = useUiSettings();
  return (
    <div
      className={clsx(
        'mb-3 flex items-center text-sm font-medium text-black/40',
        'dark:text-white/40'
      )}
    >
      {children}{' '}
      <StyledTooltip
        className="z-[6] ml-1"
        position={position}
        offsetX={offsetTooltip}
        content={<div className="w-60">{tooltipText}</div>}
        themeColor={isLightTheme ? 'white' : 'black'}
      >
        <InfoIcon className="h-4 w-4 cursor-pointer text-gray" />
      </StyledTooltip>
    </div>
  );
}
