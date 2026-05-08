import type { Category } from './category';
import type { Question, ObjectiveQuestionType } from './question';
import type { WrongQuestionStatus } from './answer';

export interface QuestionListParams {
  subjectId?: string;
  chapterId?: string;
  type?: ObjectiveQuestionType;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface CategoryTreeResult {
  subjects: Category[];
  chapters: Category[];
  knowledgePoints: Category[];
}

export interface QuestionWithUserState extends Question {
  isFavorite: boolean;
  wrongQuestionStatus?: WrongQuestionStatus;
}

export interface PracticeStatsSubjectItem {
  subjectId: string;
  totalAnswered: number;
  correctAnswered: number;
  accuracy: number;
}

export interface PracticeStatsChapterItem extends PracticeStatsSubjectItem {
  chapterId: string;
}

export interface PracticeStats {
  totalAnswered: number;
  correctAnswered: number;
  accuracy: number;
  wrongQuestionCount: number;
  favoriteQuestionCount: number;
  subjects: PracticeStatsSubjectItem[];
  chapters: PracticeStatsChapterItem[];
}
