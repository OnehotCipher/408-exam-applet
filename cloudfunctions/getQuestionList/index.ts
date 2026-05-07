import cloud from 'wx-server-sdk';
import { success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

export async function main(event: { subjectId?: string; chapterId?: string; page?: number; pageSize?: number }) {
  const page = Math.max(Number(event.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(event.pageSize || 10), 1), 50);
  const where: Record<string, unknown> = { status: 'published' };

  if (event.subjectId) where.subjectId = event.subjectId;
  if (event.chapterId) where.chapterId = event.chapterId;

  const query = db.collection('questions').where(where);
  const [items, count] = await Promise.all([
    query.skip((page - 1) * pageSize).limit(pageSize).get(),
    query.count()
  ]);

  return success({ items: items.data, total: count.total });
}
