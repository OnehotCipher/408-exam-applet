import { describe, expect, it } from 'vitest';
import { normalizeAnswerKeys } from './question';

describe('normalizeAnswerKeys', () => {
  it('uppercases, deduplicates and sorts keys', () => {
    expect(normalizeAnswerKeys(['b', 'A', 'a'])).toEqual(['A', 'B']);
  });
});
