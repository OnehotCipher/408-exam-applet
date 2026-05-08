import cloud from 'wx-server-sdk';
import { success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

export async function main(event: { type?: string; parentId?: string }) {
  const where: Record<string, unknown> = { enabled: true };

  if (event.type) where.type = event.type;
  if (event.parentId) where.parentId = event.parentId;

  const result = await db.collection('categories').where(where).orderBy('sortOrder', 'asc').get();

  return success({ items: result.data });
}
