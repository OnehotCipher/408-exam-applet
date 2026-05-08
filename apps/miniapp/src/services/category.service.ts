import type { Category } from '@study408/shared';
import { callCloudFunction } from './cloud';

interface CloudLike {
  callFunction(input: { name: string; data?: unknown }): Promise<{ result?: unknown }>;
}

export function getCategories(cloud: CloudLike, params: { type?: string; parentId?: string } = {}) {
  return callCloudFunction<{ items: Category[] }>(cloud, 'getCategories', params);
}
