import { describe, expect, it } from 'vitest';
import { gradeObjectiveAnswer } from './objective-grading';

describe('gradeObjectiveAnswer', () => {
  it('marks single choice correct when normalized answer matches', () => {
    const result = gradeObjectiveAnswer({
      questionId: 'q1',
      questionType: 'single_choice',
      correctAnswer: ['A'],
      userAnswer: ['a'],
      maxScore: 2
    });

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(2);
  });

  it('marks multiple choice wrong when answer set differs', () => {
    const result = gradeObjectiveAnswer({
      questionId: 'q2',
      questionType: 'multiple_choice',
      correctAnswer: ['A', 'C'],
      userAnswer: ['A'],
      maxScore: 2
    });

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(0);
  });
});
