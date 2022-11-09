import React from 'react';
import type { IconProps } from '../icon.types';

export const PolygonIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      width="51"
      height="50"
      viewBox="0 0 51 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0.5" width="50" height="50" rx="25" fill="#7A4ADD" />
      <g clipPath="url(#clip0_3482_143444)">
        <path
          d="M33.5645 20.2197C33.0107 19.9033 32.2988 19.9033 31.666 20.2197L27.2363 22.8301L24.2305 24.4912L19.8799 27.1016C19.3262 27.418 18.6143 27.418 17.9814 27.1016L14.5801 25.0449C14.0264 24.7285 13.6309 24.0957 13.6309 23.3838V19.4287C13.6309 18.7959 13.9473 18.1631 14.5801 17.7676L17.9814 15.79C18.5352 15.4736 19.2471 15.4736 19.8799 15.79L23.2813 17.8467C23.835 18.1631 24.2305 18.7959 24.2305 19.5078V22.1182L27.2363 20.3779V17.6885C27.2363 17.0557 26.9199 16.4229 26.2871 16.0273L19.959 12.3096C19.4053 11.9932 18.6934 11.9932 18.0605 12.3096L11.5742 16.1064C10.9414 16.4229 10.625 17.0557 10.625 17.6885V25.124C10.625 25.7568 10.9414 26.3896 11.5742 26.7852L17.9814 30.5029C18.5352 30.8193 19.2471 30.8193 19.8799 30.5029L24.2305 27.9717L27.2363 26.2314L31.5869 23.7002C32.1406 23.3838 32.8525 23.3838 33.4854 23.7002L36.8867 25.6777C37.4404 25.9941 37.8359 26.627 37.8359 27.3389V31.2939C37.8359 31.9268 37.5195 32.5596 36.8867 32.9551L33.5645 34.9326C33.0107 35.249 32.2988 35.249 31.666 34.9326L28.2646 32.9551C27.7109 32.6387 27.3154 32.0059 27.3154 31.2939V28.7627L24.3096 30.5029V33.1133C24.3096 33.7461 24.626 34.3789 25.2588 34.7744L31.666 38.4922C32.2197 38.8086 32.9316 38.8086 33.5645 38.4922L39.9717 34.7744C40.5254 34.458 40.9209 33.8252 40.9209 33.1133V25.5986C40.9209 24.9658 40.6045 24.333 39.9717 23.9375L33.5645 20.2197Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_3482_143444">
          <rect width="30.375" height="26.499" fill="white" transform="translate(10.625 12.1504)" />
        </clipPath>
      </defs>
    </svg>
  );
};