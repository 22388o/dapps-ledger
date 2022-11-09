import React from 'react';
import type { IconProps } from '../icon.types';

export const FantomIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50Z"
        fill="#0C15E4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.875 20.1562L32.5 16.875V23.4375L26.875 20.1562ZM32.5 34.2188L25 38.5938L17.5 34.2188V26.5625L25 30.9375L32.5 26.5625V34.2188ZM17.5 16.875L23.125 20.1562L17.5 23.4375V16.875ZM25.9375 21.7187L31.5625 25L25.9375 28.2812V21.7187ZM24.0625 28.2812L18.4375 25L24.0625 21.7187V28.2812ZM31.5625 15.3125L25 19.0625L18.4375 15.3125L25 11.4063L31.5625 15.3125ZM15.625 14.6875V35.1562L25 40.4688L34.375 35.1562V14.6875L25 9.375L15.625 14.6875Z"
        fill="white"
      />
    </svg>
  );
};
