import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSeedData, type SeedManifest } from './seed';
import type { Category } from './category';
import type { Question } from './question';

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(repoRoot, path), 'utf-8')) as T;
}

describe('Phase 2 seed data', () => {
  it('is internally consistent and reaches the required question count', () => {
    const manifest = readJson<SeedManifest>('data/seeds/seed-manifest.json');
    const categories = readJson<Category[]>(manifest.categoryFile);
    const questions = manifest.questionFiles.flatMap((file) => readJson<Question[]>(file));

    expect(validateSeedData({ categories, questions, manifest })).toEqual([]);
    expect(questions).toHaveLength(24);
    expect(new Set(questions.map((question) => question.subjectId))).toEqual(
      new Set(['data-structure', 'computer-organization', 'operating-system', 'computer-network'])
    );
    expect(questions.some((question) => question.type === 'single_choice')).toBe(true);
    expect(questions.some((question) => question.type === 'multiple_choice')).toBe(true);
  });
});
