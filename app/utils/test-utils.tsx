import type { FC, ReactElement } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { RootStore, StoreProvider } from '~/store/rootStore';
import { type UIContextType, UiSettingsProvider, styledComponentsTheme } from '~/UiProvider';
import { MODE_TYPES, THEME_TYPES } from '~/constants';

const uiContextValue: UIContextType = {
  state: {
    mode: MODE_TYPES.CLASSIC,
    theme: THEME_TYPES.LIGHT,
  },
  changeMode: () => {},
  changeTheme: () => {},
  isLightTheme: true,
  isSimpleMode: false,
};

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = new RootStore({ fromAmount: '0' });

  return (
    <UiSettingsProvider value={uiContextValue}>
      <ThemeProvider theme={styledComponentsTheme}>
        <StoreProvider value={store}>{children}</StoreProvider>
      </ThemeProvider>
    </UiSettingsProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
