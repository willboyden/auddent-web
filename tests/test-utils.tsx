import type { ReactElement } from 'react';
import { ThemeProvider } from '@emotion/react';
import { render as rtlRender } from '@testing-library/react';
import { theme } from '../src/theme';

function render(ui: ReactElement) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    ),
  });
}

export { render };
