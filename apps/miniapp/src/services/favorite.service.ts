import type { PaginatedResult, Question } from '@study408/shared';
import { callCloudFunction } from './cloud';

interface CloudLike {
  callFunction(input: { name: string; data?: unknown }): Promise<{ result?: unknown }>;
}

export function toggleFavoriteQuestion(cloud: CloudLike, questionId: string) {
  return callCloudFunction<{ questionId: string; isFavorite: boolean }>(cloud, 'toggleFavoriteQuestion', { questionId });
}

export function getFavoriteQuestions(cloud: CloudLike, params: { page?: number; pageSize?: number } = {}) {
  return callCloudFunction<PaginatedResult<Question>>(cloud, 'getFavoriteQuestions', params);
}
