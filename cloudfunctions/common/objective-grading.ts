import { normalizeAnswerKeys, type QuestionType } from '@study408/shared';

export interface GradeObjectiveAnswerInput {
  questionId: string;
  questionType: Exclude<QuestionType, 'subjective'>;
  correctAnswer: string[];
  userAnswer: string[];
  maxScore: number;
}

export function gradeObjectiveAnswer(input: GradeObjectiveAnswerInput) {
  const correctAnswer = normalizeAnswerKeys(input.correctAnswer);
  const userAnswer = normalizeAnswerKeys(input.userAnswer);
  const isCorrect = correctAnswer.length === userAnswer.length && correctAnswer.every((key, index) => key === userAnswer[index]);

  return {
    questionId: input.questionId,
    questionType: input.questionType,
    userAnswer,
    correctAnswer,
    isCorrect,
    score: isCorrect ? input.maxScore : 0,
    maxScore: input.maxScore
  };
}
