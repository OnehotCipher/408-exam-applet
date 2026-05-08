export type QuestionType = 'single_choice' | 'multiple_choice' | 'subjective';
export type ObjectiveQuestionType = Exclude<QuestionType, 'subjective'>;
export type QuestionStatus = 'draft' | 'published' | 'disabled';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type SourceType = 'original' | 'public_reference' | 'licensed';

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
  year?: number | null;
  source?: string;
  sourceType: SourceType;
  sourceLabel: string;
  tags: string[];
  status: QuestionStatus;
}

export interface ObjectiveQuestion extends Question {
  type: ObjectiveQuestionType;
}

export function normalizeAnswerKeys(keys: string[]): string[] {
  return Array.from(new Set(keys.map((key) => key.trim().toUpperCase()))).sort();
}
