import { createCookieSessionStorage } from '@remix-run/node';

import { isMode, isTheme } from './UiProvider';
import { type MODE_TYPES, type THEME_TYPES } from '~/constants';

const sessionSecret = process.env.COOKIE_SESSION_SECRET ?? 'defaultkey';

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'changelly_ui_settings',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
  },
});

async function getUiSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));
  return {
    getTheme: () => {
      const themeValue = session.get('theme');
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: THEME_TYPES) => session.set('theme', theme),
    getMode: () => {
      const modeValue = session.get('mode');
      return isMode(modeValue) ? modeValue : null;
    },
    setMode: (mode: MODE_TYPES) => session.set('mode', mode),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getUiSession };
