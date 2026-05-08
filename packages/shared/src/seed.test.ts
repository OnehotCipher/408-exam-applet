import { describe, expect, it } from 'vitest';
import { validateSeedData, type SeedManifest } from './seed';
import type { Category } from './category';
import type { Question } from './question';

const categories: Category[] = [
  { _id: 'data-structure', type: 'subject', name: '数据结构', parentId: null, sortOrder: 1, enabled: true },
  { _id: 'ds-linear-list', type: 'chapter', name: '线性表', parentId: 'data-structure', sortOrder: 1, enabled: true },
  { _id: 'ds-linear-list-concept', type: 'knowledge_point', name: '线性表概念', parentId: 'ds-linear-list', sortOrder: 1, enabled: true }
];

const questions: Question[] = [
  {
    _id: 'ds-linear-list-001',
    type: 'single_choice',
    subjectId: 'data-structure',
    chapterId: 'ds-linear-list',
    knowledgePointIds: ['ds-linear-list-concept'],
    stem: '线性表的顺序存储结构中，逻辑上相邻的元素在物理位置上通常具有什么关系？',
    options: [
      { key: 'A', text: '一定相邻' },
      { key: 'B', text: '一定不相邻' },
      { key: 'C', text: '随机分布' },
      { key: 'D', text: '由指针链接' }
    ],
    answer: ['A'],
    analysis: '顺序存储结构用一组地址连续的存储单元依次存储线性表元素。',
    score: 1,
    difficulty: 'easy',
    year: null,
    sourceType: 'original',
    sourceLabel: 'Phase 2 seed original',
    tags: ['线性表', '顺序存储'],
    status: 'published'
  }
];

const manifest: SeedManifest = {
  version: '2026.05.08',
  description: 'Phase 2 seed data',
  categoryFile: 'data/seeds/categories.json',
  questionFiles: ['data/seeds/questions/data-structure.json'],
  minimumQuestionCount: 1,
  createdForPhase: 'phase-2-objective-loop'
};

describe('validateSeedData', () => {
  it('accepts valid categories and objective questions', () => {
    expect(validateSeedData({ categories, questions, manifest })).toEqual([]);
  });

  it('reports broken category references and invalid answers', () => {
    const broken = [{ ...questions[0], chapterId: 'missing-chapter', answer: ['Z'] }];

    expect(validateSeedData({ categories, questions: broken, manifest })).toEqual([
      '题目 ds-linear-list-001 引用了不存在的 chapterId: missing-chapter',
      '题目 ds-linear-list-001 的答案 Z 不存在于选项中'
    ]);
  });
});
