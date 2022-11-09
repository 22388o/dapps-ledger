import React, { useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { TooltipArrowIcon } from '~/components/Icon/TooltipArrowIcon';

export type TooltipPosition = 'right' | 'top' | 'bottom';
export type TooltipOffsetX = 'left' | 'right';
export type TooltipTheme = 'gray' | 'white' | 'black';
interface Props {
  position: TooltipPosition;
  content: React.ReactNode;
  offsetX?: TooltipOffsetX;
  className?: string;
  themeColor?: TooltipTheme;
}

export const Tooltip: React.FC<Props> = React.memo(function Tooltip({
  position,
  offsetX,
  content,
  children,
  className,
  themeColor = 'gray',
}) {
  const [isShow, setIsShow] = useState(false);

  const showPopup = () => {
    setIsShow(true);
  };

  const hidePopup = () => {
    setIsShow(false);
  };

  return (
    <div
      className={clsx('relative', className)}
      onMouseLeave={hidePopup}
      onMouseMove={showPopup}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
      <AnimatePresence>
        {isShow && (
          <motion.div
            className={clsx(
              'absolute z-[10] rounded-xl p-4 text-left text-sm font-medium normal-case shadow',
              position === 'right' && 'left-full top-1/2 ml-[7px] -translate-y-1/2',
              position === 'top' && 'bottom-full left-1/2 mb-[7px] -translate-x-1/2',
              position === 'bottom' && 'top-full left-1/2 mt-[7px] -translate-x-1/2',
              offsetX === 'right' && `-translate-x-1/4`,
              offsetX === 'left' && `-translate-x-3/4`,
              themeColor === 'gray' && 'bg-gray text-white',
              themeColor === 'white' && 'bg-white text-black',
              themeColor === 'black' &&
                'bg-black text-white shadow-lightDarkShadow border-lightBlack'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="tooltip"
          >
            <TooltipArrowIcon
              className={clsx(
                'absolute',
                position === 'right' && 'top-1/2 -left-[7px] -translate-y-1/2 -rotate-90',
                position === 'top' && 'top-full left-1/2 -mt-px -translate-x-1/2 rotate-180',
                position === 'bottom' && 'bottom-full left-1/2 -mb-px -translate-x-1/2',
                offsetX === 'right' && `left-1/4`,
                offsetX === 'left' && `left-3/4 -translate-x-1/4`,
                themeColor === 'gray' && 'text-gray',
                themeColor === 'white' && 'text-white',
                themeColor === 'black' && 'text-black'
              )}
            />
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
