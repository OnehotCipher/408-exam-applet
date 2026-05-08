import cloud from 'wx-server-sdk';
import { failure, success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const allowedStatuses = new Set(['unresolved', 'reviewing', 'resolved']);

export async function main(event: { questionId?: string; status?: string }) {
  const openid = cloud.getWXContext().OPENID;

  if (!event.questionId || !event.status || !allowedStatuses.has(event.status)) {
    return failure('INVALID_PARAMS', '参数不完整');
  }

  const result = await db.collection('wrong_questions').where({ openid, questionId: event.questionId }).limit(1).get();
  const record = result.data[0];

  if (!record?._id) return failure('NOT_FOUND', '错题记录不存在');

  await db.collection('wrong_questions').doc(record._id).update({ data: { status: event.status, updatedAt: new Date() } });

  return success({ questionId: event.questionId, status: event.status });
}
