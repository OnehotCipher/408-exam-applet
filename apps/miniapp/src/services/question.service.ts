import type { PaginatedResult, Question, QuestionListParams } from '@study408/shared';
import { callCloudFunction } from './cloud';

interface CloudLike {
  callFunction(input: { name: string; data?: unknown }): Promise<{ result?: unknown }>;
}

export function getQuestionList(cloud: CloudLike, params: QuestionListParams) {
  return callCloudFunction<PaginatedResult<Question>>(cloud, 'getQuestionList', params);
}

export function getQuestionDetail(cloud: CloudLike, questionId: string) {
  return callCloudFunction<Question>(cloud, 'getQuestionDetail', { questionId });
}
