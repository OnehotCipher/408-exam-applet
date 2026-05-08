import type { ObjectiveQuestionType, QuestionType } from './question';

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

export interface SubmitAnswerResult extends ObjectiveGradingResult {
  wrongQuestionStatus?: WrongQuestionStatus;
}

export interface WrongQuestionRecord {
  _id?: string;
  openid: string;
  questionId: string;
  questionType: ObjectiveQuestionType;
  status: WrongQuestionStatus;
  wrongCount: number;
  lastWrongAt: Date;
  updatedAt: Date;
}

export interface FavoriteQuestionRecord {
  _id?: string;
  openid: string;
  questionId: string;
  createdAt: Date;
}
