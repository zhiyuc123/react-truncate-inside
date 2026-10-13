import * as React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import Truncate from '../src';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('renders the full text without throwing when canvas and ResizeObserver are unavailable', () => {
  // jsdom: getContext() returns null (stubbed here to keep its
  // "not implemented" noise out of the output) and ResizeObserver does not
  // exist. Consumers' own jsdom test suites hit exactly this path.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  vi.stubGlobal('ResizeObserver', undefined);

  const { container } = render(
    <Truncate text="abcdefghijklmnop" width={100} />
  );

  expect(container.textContent).toBe('abcdefghijklmnop');
});
