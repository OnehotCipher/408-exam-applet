import type { ApiResponse } from '@study408/shared';

interface CloudLike {
  callFunction(input: { name: string; data?: unknown }): Promise<{ result?: unknown }>;
}

export async function callCloudFunction<T>(cloud: CloudLike, name: string, data?: unknown): Promise<T> {
  const response = await cloud.callFunction({ name, data });
  const result = response.result as ApiResponse<T> | undefined;

  if (!result) throw new Error('云函数无返回结果');
  if (!result.success) throw new Error(result.error?.message || '云函数调用失败');

  return result.data as T;
}
