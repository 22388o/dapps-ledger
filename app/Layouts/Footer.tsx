import React from 'react';
import clsx from 'clsx';
import { useLocation, useNavigate, useParams } from '@remix-run/react';

import { Logo } from '~/components/Logo';
import { redirectToHome } from './helpers';
import { STORAGE_KEYS, useLocalStorage } from '~/hooks';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from, to } = useParams();

  const [settings] = useLocalStorage(STORAGE_KEYS.SETTINGS);

  const isApiPage = location.pathname === '/api';
  const isMainPage = !!from && !!to;

  if (isMainPage) {
    return null;
  }

  return (
    <footer>
      <div
        className={clsx(
          'relative mx-auto max-w-[1400px] px-2.5 sm:px-11 py-5 text-center',
          'justify-between flex items-end sm:items-center'
        )}
      >
        <button
          onClick={() => {
            redirectToHome(navigate, settings);
          }}
          className="flex justify-center"
        >
          <Logo className={clsx('h-9', isApiPage && 'text-white')} hideNameOnMobile />
        </button>
      </div>
    </footer>
  );
};
