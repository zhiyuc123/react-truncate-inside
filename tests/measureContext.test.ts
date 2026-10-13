// @vitest-environment node
import { expect, it } from 'vitest';
import { getMeasureContext } from '../src/measureContext';

it('returns null instead of throwing where there is no document', () => {
  expect(typeof document).toBe('undefined');
  expect(getMeasureContext()).toBeNull();
});
