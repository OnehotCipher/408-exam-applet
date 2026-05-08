import type { PracticeStats } from '@study408/shared';
import { callCloudFunction } from './cloud';

interface CloudLike {
  callFunction(input: { name: string; data?: unknown }): Promise<{ result?: unknown }>;
}

export function getPracticeStats(cloud: CloudLike) {
  return callCloudFunction<PracticeStats>(cloud, 'getPracticeStats');
}
