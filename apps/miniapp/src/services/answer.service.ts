import type { ObjectiveGradingResult } from '@study408/shared';
import { callCloudFunction } from './cloud';

interface CloudLike {
  callFunction(input: { name: string; data?: unknown }): Promise<{ result?: unknown }>;
}

export function submitAnswer(cloud: CloudLike, params: { questionId: string; userAnswer: string[]; durationSeconds: number }) {
  return callCloudFunction<ObjectiveGradingResult>(cloud, 'submitAnswer', params);
}
