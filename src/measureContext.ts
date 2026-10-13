/**
 * A single off-screen 2D canvas context shared by every Truncate instance.
 *
 * All measuring is synchronous and `font` is set right before each use, so
 * one context is enough; a page with thousands of truncated labels would
 * otherwise allocate thousands of canvas elements. The canvas is never
 * attached to the DOM and has no visual effect.
 *
 * `undefined` means "not tried yet", `null` means "tried, not available".
 */
let sharedContext: CanvasRenderingContext2D | null | undefined;

/**
 * Returns the shared measuring context, creating it on first use.
 *
 * Returns `null` where a canvas cannot be created: during server-side
 * rendering (no `document`) and in DOM implementations without canvas
 * support (e.g. jsdom). Callers must then skip measuring.
 */
export function getMeasureContext(): CanvasRenderingContext2D | null {
  if (sharedContext === undefined) {
    sharedContext =
      typeof document === 'undefined'
        ? null
        : document.createElement('canvas').getContext('2d');
  }
  return sharedContext;
}
