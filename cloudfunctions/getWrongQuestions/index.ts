import cloud from 'wx-server-sdk';
import { success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

export async function main(event: { status?: string; page?: number; pageSize?: number }) {
  const openid = cloud.getWXContext().OPENID;
  const page = Math.max(Number(event.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(event.pageSize || 10), 1), 50);
  const where: Record<string, unknown> = { openid };

  if (event.status) where.status = event.status;

  const wrongResult = await db.collection('wrong_questions').where(where).skip((page - 1) * pageSize).limit(pageSize).get();
  const questionIds = wrongResult.data.map((item) => item.questionId);
  const questions = questionIds.length === 0 ? { data: [] } : await db.collection('questions').where({ _id: _.in(questionIds), status: 'published' }).get();
  const count = await db.collection('wrong_questions').where(where).count();

  return success({ items: questions.data, wrongRecords: wrongResult.data, total: count.total, page, pageSize });
}
