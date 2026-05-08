import type { Question } from '@study408/shared';
import { callCloudFunction } from './cloud';

interface CloudLike {
  callFunction(input: { name: string; data?: unknown }): Promise<{ result?: unknown }>;
}

export function getQuestionList(cloud: CloudLike, params: { subjectId?: string; chapterId?: string }) {
  return callCloudFunction<{ items: Question[]; total: number }>(cloud, 'getQuestionList', params);
}
