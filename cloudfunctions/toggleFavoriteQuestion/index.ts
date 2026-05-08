import cloud from 'wx-server-sdk';
import { failure, success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

export async function main(event: { questionId?: string }) {
  const openid = cloud.getWXContext().OPENID;

  if (!event.questionId) return failure('INVALID_PARAMS', '缺少 questionId');

  const existing = await db.collection('favorite_questions').where({ openid, questionId: event.questionId }).limit(1).get();
  const favorite = existing.data[0];

  if (favorite?._id) {
    await db.collection('favorite_questions').doc(favorite._id).remove();
    return success({ questionId: event.questionId, isFavorite: false });
  }

  await db.collection('favorite_questions').add({ data: { openid, questionId: event.questionId, createdAt: new Date() } });

  return success({ questionId: event.questionId, isFavorite: true });
}
