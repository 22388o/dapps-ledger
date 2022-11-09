import React from 'react';
import clsx from 'clsx';

import type { Token } from '~/objects/tokens';

interface Props {
  className?: string;
  token: Token | null;
}

export const TokenIcon: React.FC<Props> = ({ token, className }) => {
  return (
    <div
      className={clsx(
        'flex h-[30px] w-[30px] min-w-[30px] items-center justify-center rounded-full bg-contain',
        className
      )}
      style={{
        ...(token && { backgroundImage: `url(${token.logoURI})` }),
      }}
    />
  );
};
