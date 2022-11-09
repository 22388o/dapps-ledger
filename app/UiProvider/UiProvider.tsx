// How does it work -> https://www.mattstobbs.com/remix-dark-mode/
import { useState, useEffect, createContext } from 'react';
import { useFetcher } from '@remix-run/react';
import {
  type DefaultTheme as StyledComponentsDefaultTheme,
  ThemeProvider,
} from 'styled-components';

import { useIsMounted } from '~/hooks';
import { MODE_TYPES, THEME_TYPES } from '~/constants';
import { isServer } from '~/helpers/helpers';

export const prefersDarkMQ = '(prefers-color-scheme: dark)';

const getPreferredTheme = () =>
  window.matchMedia(prefersDarkMQ)?.matches ? THEME_TYPES.DARK : THEME_TYPES.LIGHT;

const themes: Array<THEME_TYPES> = Object.values(THEME_TYPES);
const modes: Array<MODE_TYPES> = Object.values(MODE_TYPES);

export function isTheme(value: unknown): value is THEME_TYPES {
  return typeof value === 'string' && themes.includes(value as THEME_TYPES);
}

export function isMode(value: unknown): value is MODE_TYPES {
  return typeof value === 'string' && modes.includes(value as MODE_TYPES);
}

export const styledComponentsTheme: StyledComponentsDefaultTheme = {
  colors: {
    transparent: 'transparent',
    green: '#00633A',
    darkGreen: '#004a2c',
    red: '#FF809E',
    darkRed: '#D82423',
    blue: '#0080D0',
    darkBlue: '#2F5CE2',
    yellow: '#FEFC9E',
    actionBlue: '#1268BB;',
    lightBlue: '#2BB6F2',
    orange: '#FB5400',
    lightOrange: '#D44700',
    orangeSecondary: '#FEBB99',
    black: '#000',
    gray: '#A0A0A0',
    graySecondary: '#6F6F6F',
    grayTretiary: '#D5D5D5',
    lightGray: '#F2F2F2',
    white: '#FFF',
    lightBlack: '#212121',
    dark: '#0F0F0F',
  },
};

export type UIContextType = {
  state: {
    mode: string | null;
    theme: string | null;
  };
  changeMode: (newMode: MODE_TYPES) => void;
  changeTheme: (newTheme: THEME_TYPES) => void;
  isSimpleMode: boolean;
  isLightTheme: boolean;
};

export const UiSettingsContext = createContext<UIContextType | undefined>(undefined);

export const UiSettingsProvider = UiSettingsContext.Provider;

const defaultMode = MODE_TYPES.SIMPLE;

interface Props {
  children: React.ReactNode;
  specifiedTheme: THEME_TYPES | null;
  specifiedMode: MODE_TYPES | null;
}

export const UiProvider = ({ children, specifiedTheme, specifiedMode }: Props) => {
  const [stateMode, setStateMode] = useState<MODE_TYPES | null>(() => {
    if (specifiedMode && modes.includes(specifiedMode)) {
      return specifiedMode;
    }

    if (isServer) {
      return defaultMode;
    }

    return defaultMode;
  });

  const [stateTheme, setStateTheme] = useState<THEME_TYPES | null>(() => {
    if (specifiedTheme && themes.includes(specifiedTheme)) {
      return specifiedTheme;
    }

    if (isServer) {
      return null;
    }

    return getPreferredTheme();
  });

  const isMounted = useIsMounted();

  const uiFetcher = useFetcher();

  useEffect(() => {
    if (!isMounted || !stateTheme || !stateMode) {
      return;
    }

    // set theme param to cookie. Handler located in ~/app/routes/action/set-ui-settings

    uiFetcher.submit(
      { theme: stateTheme, mode: stateMode },
      { action: 'action/set-ui-settings', method: 'post' }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateTheme, stateMode]);

  useEffect(() => {
    // create event for changing theme when an user changed theme on a computer

    const mediaQuery = window.matchMedia(prefersDarkMQ);

    const handleChange = () => {
      setStateTheme(mediaQuery.matches ? THEME_TYPES.DARK : THEME_TYPES.LIGHT);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const changeMode = (newMode: MODE_TYPES) => {
    setStateMode(isMode(newMode) ? newMode : defaultMode);
  };

  const changeTheme = (newTheme: THEME_TYPES) => {
    setStateTheme(isTheme(newTheme) ? newTheme : THEME_TYPES.LIGHT);
  };

  const isSimpleMode = stateMode === MODE_TYPES.SIMPLE;
  const isLightTheme = stateTheme === THEME_TYPES.LIGHT;

  const contextValue = {
    state: {
      mode: stateMode,
      theme: stateTheme,
    },
    changeMode,
    changeTheme,
    isSimpleMode,
    isLightTheme,
  };

  return (
    <UiSettingsProvider value={contextValue}>
      <ThemeProvider theme={styledComponentsTheme}>{children}</ThemeProvider>
    </UiSettingsProvider>
  );
};
