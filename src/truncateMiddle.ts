export interface TruncateMiddleOptions {
  /** Width the result has to fit in, in the unit `measure` returns (px). */
  maxWidth: number;
  /** Number of characters to keep at the end of the text. */
  offset: number;
  /** String inserted where characters were removed. */
  ellipsis: string;
  /** Returns the rendered width of a string. */
  measure: (s: string) => number;
}

/**
 * Removes characters from the middle of `text` until it fits in `maxWidth`,
 * keeping the beginning and the last `offset` characters.
 *
 * Example: `ECMA-402_9th_edition_june_2022.pdf` -> `ECMA-402_9th...2022.pdf`
 *
 * The result is the longest `head + ellipsis + tail` that fits. If even a
 * one-character head does not fit, that minimal form is returned anyway so
 * the caller still gets a visibly truncated string, unless it would be wider
 * than the original text, in which case the original text is returned.
 *
 * Pure: it only talks to the outside world through `measure`, so it can be
 * used and tested without React or a DOM.
 */
export function truncateMiddle(
  text: string,
  options: TruncateMiddleOptions
): string {
  const { maxWidth, offset, ellipsis, measure } = options;

  const fullWidth = measure(text);
  if (fullWidth <= maxWidth) return text;

  // Work on code points rather than UTF-16 code units so that surrogate pairs
  // (emoji, rare CJK characters, ...) are never cut in half.
  const chars = Array.from(text);
  const tailLength = Math.min(Math.max(offset, 0), chars.length);
  const tailStart = chars.length - tailLength;
  // The whole text is "tail": there is nothing in the middle to remove.
  if (tailStart === 0) return text;

  const tail = chars.slice(tailStart).join('');
  const candidate = (headLength: number) =>
    chars.slice(0, headLength).join('') + ellipsis + tail;

  // Binary search for the longest head that still fits.
  // Invariant: `lo` fits (0 is treated as fitting), `hi` does not fit.
  // `hi = tailStart` is known not to fit: with that head, the candidate is
  // the full text plus the ellipsis, and the full text already overflows.
  let lo = 0;
  let hi = tailStart;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (measure(candidate(mid)) <= maxWidth) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  if (lo > 0) return candidate(lo);

  // Nothing fits. Still show one leading character so the user can tell what
  // the text starts with, as long as that is not wider than the original.
  const minimal = candidate(1);
  return measure(minimal) < fullWidth ? minimal : text;
}
