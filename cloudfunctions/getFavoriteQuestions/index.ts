import cloud from 'wx-server-sdk';
import { success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

export async function main(event: { page?: number; pageSize?: number }) {
  const openid = cloud.getWXContext().OPENID;
  const page = Math.max(Number(event.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(event.pageSize || 10), 1), 50);
  const favoriteResult = await db.collection('favorite_questions').where({ openid }).skip((page - 1) * pageSize).limit(pageSize).get();
  const questionIds = favoriteResult.data.map((item) => item.questionId);
  const questions = questionIds.length === 0 ? { data: [] } : await db.collection('questions').where({ _id: _.in(questionIds), status: 'published' }).get();
  const count = await db.collection('favorite_questions').where({ openid }).count();

  return success({ items: questions.data, total: count.total, page, pageSize });
}
