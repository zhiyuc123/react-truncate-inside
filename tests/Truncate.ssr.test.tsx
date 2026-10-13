// @vitest-environment node
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import Truncate from '../src';

it('renders the full text on the server, where there is no DOM', () => {
  expect(typeof document).toBe('undefined');
  const consoleError = vi.spyOn(console, 'error');

  const html = renderToString(<Truncate text="abcdefghijklmnop" width={100} />);

  expect(html).toContain('abcdefghijklmnop');
  // e.g. React's "useLayoutEffect does nothing on the server" warning
  expect(consoleError).not.toHaveBeenCalled();
});
