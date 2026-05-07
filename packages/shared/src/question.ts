export type QuestionType = 'single_choice' | 'multiple_choice' | 'subjective';
export type QuestionStatus = 'draft' | 'published' | 'disabled';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  _id: string;
  type: QuestionType;
  subjectId: string;
  chapterId: string;
  knowledgePointIds: string[];
  stem: string;
  options: QuestionOption[];
  answer: string[];
  analysis: string;
  referenceAnswer?: string;
  gradingRubric?: string;
  score: number;
  difficulty: Difficulty;
  year?: number;
  source?: string;
  status: QuestionStatus;
}

export function normalizeAnswerKeys(keys: string[]): string[] {
  return Array.from(new Set(keys.map((key) => key.trim().toUpperCase()))).sort();
}
