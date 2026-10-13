import * as React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import Truncate from '../src';

// jsdom has neither canvas nor layout, so both are stood in for here.
//
// Measurement: every code point is `charWidth` px wide, so with the default
// "..." ellipsis and offset 8, "abcdefghijklmnop" (160px) becomes
//   "abcd...ijklmnop" at 150px and "a...ijklmnop" at 120px.
let charWidth = 10;
const fakeContext = {
  font: '',
  measureText: (s: string) => ({ width: Array.from(s).length * charWidth }),
};

// Layout: the element's own inline width if it has one, otherwise the width
// of the (fake) parent it fills.
let parentWidth = 300;

// ResizeObserver: record callbacks so a test can simulate a resize.
const resizeCallbacks: Array<() => void> = [];
class FakeResizeObserver {
  constructor(callback: () => void) {
    resizeCallbacks.push(callback);
  }
  observe() {
    // Layout is faked, so there is nothing to observe; tests call the
    // recorded callbacks directly.
  }
  disconnect() {
    // Nothing to tear down.
  }
}

const TEXT = 'abcdefghijklmnop';

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    fakeContext as unknown as CanvasRenderingContext2D
  );
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: Element) {
      const inlineWidth = (this as HTMLElement).style.width;
      const width = inlineWidth.endsWith('px')
        ? parseFloat(inlineWidth)
        : parentWidth;
      return {
        width,
        height: 0,
        top: 0,
        left: 0,
        right: width,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect;
    }
  );
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  resizeCallbacks.length = 0;
  charWidth = 10;
  parentWidth = 300;
});

describe('Truncate', () => {
  it('truncates the middle when the text is wider than its fixed width', () => {
    const { container } = render(<Truncate text={TEXT} width={150} />);
    expect(container.textContent).toBe('abcd...ijklmnop');
  });

  it('renders the full text when it fits', () => {
    const { container } = render(<Truncate text={TEXT} width={200} />);
    expect(container.textContent).toBe(TEXT);
  });

  it('applies `width` as the CSS width of the element', () => {
    const { container } = render(<Truncate text={TEXT} width={150} />);
    expect((container.firstChild as HTMLElement).style.width).toBe('150px');
  });

  it('fills the parent and truncates to its width when `width` is omitted', () => {
    parentWidth = 120;
    const { container } = render(<Truncate text={TEXT} />);
    expect((container.firstChild as HTMLElement).style.width).toBe('100%');
    expect(container.textContent).toBe('a...ijklmnop');
  });

  it('re-truncates when the container is resized', () => {
    parentWidth = 150;
    const { container } = render(<Truncate text={TEXT} />);
    expect(container.textContent).toBe('abcd...ijklmnop');

    parentWidth = 120;
    act(() => resizeCallbacks.forEach((callback) => callback()));
    expect(container.textContent).toBe('a...ijklmnop');
  });

  it('re-truncates when the `width` prop changes', () => {
    const { container, rerender } = render(
      <Truncate text={TEXT} width={150} />
    );
    expect(container.textContent).toBe('abcd...ijklmnop');

    rerender(<Truncate text={TEXT} width={120} />);
    expect(container.textContent).toBe('a...ijklmnop');
  });

  it('re-truncates when the `text` prop changes', () => {
    const { container, rerender } = render(
      <Truncate text={TEXT} width={150} />
    );
    expect(container.textContent).toBe('abcd...ijklmnop');

    rerender(<Truncate text="0123456789" width={150} />);
    expect(container.textContent).toBe('0123456789');
  });

  it('re-measures after web fonts finish loading', () => {
    // A FontFaceSet stand-in: an EventTarget with the two members the
    // component reads.
    const fonts = Object.assign(new EventTarget(), {
      status: 'loaded',
      ready: Promise.resolve(),
    });
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: fonts,
    });

    try {
      const { container } = render(<Truncate text={TEXT} width={150} />);
      expect(container.textContent).toBe('abcd...ijklmnop');

      // The loaded font is wider: 15px per glyph. The computed font string
      // and the container width have not changed, only the metrics have.
      charWidth = 15;
      act(() => {
        fonts.dispatchEvent(new Event('loadingdone'));
      });
      expect(container.textContent).toBe('a...ijklmnop');
    } finally {
      delete (document as { fonts?: unknown }).fonts;
    }
  });
});
