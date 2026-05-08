import type { ApiResponse } from '@study408/shared';

export function success<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function failure<T = never>(code: string, message: string): ApiResponse<T> {
  return { success: false, error: { code, message } };
}
