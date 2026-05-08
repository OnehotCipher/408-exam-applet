import { describe, expect, it } from 'vitest';
import { buildWrongQuestionRecord, calculateAccuracy, summarizePracticeStats } from './practice-records';

const now = new Date('2026-05-08T00:00:00.000Z');

describe('practice records', () => {
  it('creates unresolved wrong question records', () => {
    expect(buildWrongQuestionRecord({ openid: 'u1', questionId: 'q1', questionType: 'single_choice', now })).toEqual({
      openid: 'u1',
      questionId: 'q1',
      questionType: 'single_choice',
      status: 'unresolved',
      wrongCount: 1,
      lastWrongAt: now,
      updatedAt: now
    });
  });

  it('calculates accuracy with zero division protected', () => {
    expect(calculateAccuracy(0, 0)).toBe(0);
    expect(calculateAccuracy(3, 4)).toBe(0.75);
  });

  it('summarizes practice stats by subject and chapter', () => {
    const stats = summarizePracticeStats({
      answers: [
        { subjectId: 'data-structure', chapterId: 'ds-linear-list', isCorrect: true },
        { subjectId: 'data-structure', chapterId: 'ds-linear-list', isCorrect: false },
        { subjectId: 'operating-system', chapterId: 'os-process', isCorrect: true }
      ],
      wrongQuestionCount: 1,
      favoriteQuestionCount: 2
    });

    expect(stats.totalAnswered).toBe(3);
    expect(stats.correctAnswered).toBe(2);
    expect(stats.accuracy).toBe(0.67);
    expect(stats.wrongQuestionCount).toBe(1);
    expect(stats.favoriteQuestionCount).toBe(2);
    expect(stats.subjects).toEqual([
      { subjectId: 'data-structure', totalAnswered: 2, correctAnswered: 1, accuracy: 0.5 },
      { subjectId: 'operating-system', totalAnswered: 1, correctAnswered: 1, accuracy: 1 }
    ]);
    expect(stats.chapters).toEqual([
      { subjectId: 'data-structure', chapterId: 'ds-linear-list', totalAnswered: 2, correctAnswered: 1, accuracy: 0.5 },
      { subjectId: 'operating-system', chapterId: 'os-process', totalAnswered: 1, correctAnswered: 1, accuracy: 1 }
    ]);
  });
});
