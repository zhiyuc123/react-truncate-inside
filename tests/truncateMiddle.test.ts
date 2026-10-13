import { describe, expect, it } from 'vitest';
import { truncateMiddle } from '../src/truncateMiddle';

// Deterministic stand-in for canvas measurement: every code point is 10px
// wide except "." which is 5px, so "..." is 15px and every expected width
// below can be derived by hand.
const measure = (s: string) =>
  Array.from(s).reduce((width, ch) => width + (ch === '.' ? 5 : 10), 0);

const FILE = 'ECMA-402_9th_edition_june_2022.pdf'; // 34 chars, 335px
const TAIL = '2022.pdf'; // the default offset of 8 keeps this, 75px

const truncate = (
  text: string,
  maxWidth: number,
  overrides: Partial<{ offset: number; ellipsis: string }> = {}
) =>
  truncateMiddle(text, {
    maxWidth,
    offset: 8,
    ellipsis: '...',
    measure,
    ...overrides,
  });

describe('truncateMiddle', () => {
  it('returns the text unchanged when it fits exactly', () => {
    expect(truncate('abcdefghij', 100)).toBe('abcdefghij');
  });

  it('keeps the longest head that fits in front of ellipsis and tail', () => {
    // head 60 + "..." 15 + tail 75 = 150
    expect(truncate(FILE, 150)).toBe('ECMA-4...' + TAIL);
  });

  it('drops a head character as soon as the width is one px short', () => {
    expect(truncate(FILE, 149)).toBe('ECMA-...' + TAIL);
  });

  it('keeps `offset` characters at the end', () => {
    // head 100 + "..." 15 + "pdf" 30 = 145; one more head char would be 155
    expect(truncate(FILE, 150, { offset: 3 })).toBe('ECMA-402_9...pdf');
  });

  it('inserts the given ellipsis', () => {
    // head 60 + "…" 10 + tail 75 = 145; one more head char would be 155
    expect(truncate(FILE, 150, { ellipsis: '…' })).toBe('ECMA-4…' + TAIL);
  });

  it('works with an empty ellipsis', () => {
    // head 20 + tail 80 = 100
    expect(truncate('abcdefghijklmnop', 100, { ellipsis: '' })).toBe(
      'abijklmnop'
    );
  });

  it('returns the text unchanged when offset covers the whole text', () => {
    // "a.pdf" is 45px and does not fit, but all 5 chars are "tail", so
    // there is nothing in the middle to remove (used to give "a...pdf").
    expect(truncate('a.pdf', 30)).toBe('a.pdf');
  });

  it('keeps the text when the minimal form would be wider than it', () => {
    // "abcdefghij" is 100px; "a...cdefghij" would be 105px.
    expect(truncate('abcdefghij', 95)).toBe('abcdefghij');
  });

  it('falls back to a one-character head when nothing fits', () => {
    // "E...2022.pdf" is 100px: wider than 40 but far narrower than 335.
    expect(truncate(FILE, 40)).toBe('E...' + TAIL);
  });

  it('never splits a surrogate pair', () => {
    const emoji = '📊📊📊📊📊📊📊📊📊📊📊📊'; // 12 code points, 24 code units
    expect(truncate(emoji, 80)).toBe('📊...📊📊📊📊📊📊📊📊');
  });

  it('truncates at the end when offset is 0', () => {
    // head 40 + "..." 15 = 55
    expect(truncate('abcdefghijklmnop', 60, { offset: 0 })).toBe('abcd...');
  });

  it('treats a negative offset as 0', () => {
    expect(truncate('abcdefghijklmnop', 60, { offset: -3 })).toBe('abcd...');
  });

  it('returns an empty string for empty text', () => {
    expect(truncate('', 10)).toBe('');
  });

  it('holds its invariants for every width', () => {
    let previousWidth = 0;
    for (let maxWidth = 0; maxWidth <= 340; maxWidth += 5) {
      const out = truncate(FILE, maxWidth);

      // Never wider than the input, and fits whenever the minimal
      // "E...2022.pdf" (100px) fits.
      expect(measure(out)).toBeLessThanOrEqual(measure(FILE));
      if (maxWidth >= 100) expect(measure(out)).toBeLessThanOrEqual(maxWidth);

      // Either untouched or "<head>...<tail>" with a non-empty head.
      if (out !== FILE) {
        expect(out.startsWith('E')).toBe(true);
        expect(out.endsWith('...' + TAIL)).toBe(true);
      }

      // More room never yields a narrower result.
      expect(measure(out)).toBeGreaterThanOrEqual(previousWidth);
      previousWidth = measure(out);
    }
  });
});
