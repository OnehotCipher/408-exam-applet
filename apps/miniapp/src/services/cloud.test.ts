import { describe, expect, it, vi } from 'vitest';
import { callCloudFunction } from './cloud';

describe('callCloudFunction', () => {
  it('returns data from a successful cloud function response', async () => {
    const cloud = {
      callFunction: vi.fn().mockResolvedValue({ result: { success: true, data: { value: 1 } } })
    };

    await expect(callCloudFunction<{ value: number }>(cloud, 'demo')).resolves.toEqual({ value: 1 });
  });

  it('throws message from a failed cloud function response', async () => {
    const cloud = {
      callFunction: vi.fn().mockResolvedValue({ result: { success: false, error: { code: 'INVALID_PARAMS', message: '参数错误' } } })
    };

    await expect(callCloudFunction(cloud, 'demo')).rejects.toThrow('参数错误');
  });
});
