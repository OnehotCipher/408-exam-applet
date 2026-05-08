import type { QuestionType } from './question';

export type WrongQuestionStatus = 'unresolved' | 'reviewing' | 'resolved';

export interface ObjectiveGradingResult {
  questionId: string;
  questionType: Exclude<QuestionType, 'subjective'>;
  userAnswer: string[];
  correctAnswer: string[];
  isCorrect: boolean;
  score: number;
  maxScore: number;
}
