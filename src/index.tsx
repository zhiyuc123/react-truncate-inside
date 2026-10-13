import * as React from 'react';
import { getMeasureContext } from './measureContext';
import { truncateMiddle } from './truncateMiddle';

export interface TruncateProps {
  /** Text to be truncated. */
  text: string;
  /**
   * Width of the element in px. When omitted the component fills its parent
   * and re-truncates whenever the parent is resized.
   * @default parentNode.width
   */
  width?: number;
  /**
   * Number of characters kept at the end of the text, i.e. the position of
   * the ellipsis counted from the end.
   * @default 8
   */
  offset?: number;
  /**
   * String inserted where characters were removed, if the text is truncated.
   * @default '...'
   */
  ellipsis?: string;
}

/**
 * `useLayoutEffect` runs before the browser paints, which lets the first
 * truncation be applied without the full text flashing on screen. On the
 * server it would only produce a warning, so fall back to `useEffect` there.
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/** What the container looked like the last time it was measured. */
interface Measurement {
  /** CSS `font` shorthand of the container, see `getCanvasFont`. */
  font: string;
  /** Rendered width of the container in px. */
  width: number;
}

/**
 * Builds a CSS `font` shorthand from an element's computed style, suitable
 * for `CanvasRenderingContext2D.font`, so canvas measurements match what the
 * browser renders for that element.
 *
 * Known limitation: properties outside the shorthand, such as
 * `letter-spacing` and `text-transform`, are not reflected in measurements.
 */
function getCanvasFont(element: Element): string {
  const style = window.getComputedStyle(element);
  return [
    style.fontWeight,
    style.fontStyle,
    style.fontSize,
    style.fontFamily,
  ].join(' ');
}

/**
 * **Truncate** renders `text` on a single line and, if it is wider than the
 * available width, replaces characters in the middle with `ellipsis` so that
 * the beginning and the last `offset` characters stay visible
 * (e.g. `ECMA-402_9th...2022.pdf`).
 *
 * Text is measured on an off-screen canvas using the element's computed font,
 * so no extra DOM nodes are created and no layout thrashing occurs.
 */
function Truncate(props: TruncateProps) {
  const { text, width = 0, offset = 8, ellipsis = '...' } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Snapshot of the environment the text has to fit in. `null` until the
  // container has been measured for the first time, which only happens in
  // the browser after mount.
  const [measurement, setMeasurement] = React.useState<Measurement | null>(
    null
  );

  // Reads the container's font and rendered width into state. The rendered
  // width is used even when `width` is given, because the parent's layout
  // (e.g. a shrinking flex item) may end up narrower than requested. The
  // container carries no padding or border of its own, so its border-box
  // width is the space the text can use.
  //
  // An unchanged snapshot is dropped so React bails out of re-rendering,
  // which makes this safe to call liberally (on mount, on prop change and on
  // every resize). `force` skips that check for callers that know the glyph
  // metrics changed even though font and width did not (web font loaded).
  const measureContainer = React.useCallback((force = false) => {
    const element = containerRef.current;
    if (!element) return;
    const next: Measurement = {
      font: getCanvasFont(element),
      width: element.getBoundingClientRect().width,
    };
    setMeasurement((prev) =>
      !force && prev && prev.font === next.font && prev.width === next.width
        ? prev
        : next
    );
  }, []);

  // Initial measurement before paint, and again when `width` changes so the
  // new width is applied in the same frame as the style change.
  useIsomorphicLayoutEffect(() => {
    measureContainer();
  }, [measureContainer, width]);

  // Re-measure when the container is resized, e.g. because the parent's
  // width follows the viewport. `ResizeObserver` also fires once right after
  // `observe()`, which just repeats the measurement above and is harmless.
  React.useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => measureContainer());
    observer.observe(element);
    return () => observer.disconnect();
  }, [measureContainer]);

  // Re-measure once web fonts that were still loading at mount become
  // available, and whenever fonts load later (e.g. a lazily loaded font).
  // The computed `font` string does not change in that case, only the glyph
  // metrics do, hence the forced measurement.
  React.useEffect(() => {
    const fonts = document.fonts;
    if (!fonts) return;

    let active = true;
    const remeasure = () => {
      if (active) measureContainer(true);
    };
    if (fonts.status === 'loading') fonts.ready.then(remeasure);
    fonts.addEventListener('loadingdone', remeasure);

    return () => {
      active = false;
      fonts.removeEventListener('loadingdone', remeasure);
    };
  }, [measureContainer]);

  const displayText = React.useMemo(() => {
    // Not measured yet (first render / SSR): show the full text rather than
    // guessing. Also bail out where no canvas is available (e.g. jsdom).
    if (!measurement) return text;
    const ctx = getMeasureContext();
    if (!ctx) return text;

    ctx.font = measurement.font;
    return truncateMiddle(text, {
      maxWidth: measurement.width,
      offset,
      ellipsis,
      measure: (s) => ctx.measureText(s).width,
    });
  }, [measurement, text, offset, ellipsis]);

  return (
    <div
      ref={containerRef}
      style={{ width: width || '100%', whiteSpace: 'nowrap' }}
    >
      {displayText}
    </div>
  );
}

export default Truncate;
