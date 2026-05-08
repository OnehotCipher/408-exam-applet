import type { PaginatedResult, Question, WrongQuestionRecord, WrongQuestionStatus } from '@study408/shared';
import { callCloudFunction } from './cloud';

interface CloudLike {
  callFunction(input: { name: string; data?: unknown }): Promise<{ result?: unknown }>;
}

export function getWrongQuestions(cloud: CloudLike, params: { status?: WrongQuestionStatus; page?: number; pageSize?: number } = {}) {
  return callCloudFunction<PaginatedResult<Question> & { wrongRecords: WrongQuestionRecord[] }>(cloud, 'getWrongQuestions', params);
}

export function updateWrongQuestionStatus(cloud: CloudLike, params: { questionId: string; status: WrongQuestionStatus }) {
  return callCloudFunction<{ questionId: string; status: WrongQuestionStatus }>(cloud, 'updateWrongQuestionStatus', params);
}
