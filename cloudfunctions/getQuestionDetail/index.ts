import cloud from 'wx-server-sdk';
import { failure, success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

export async function main(event: { questionId?: string }) {
  if (!event.questionId) return failure('INVALID_PARAMS', '缺少 questionId');

  const result = await db.collection('questions').doc(event.questionId).get();
  const question = result.data;

  if (!question || question.status !== 'published') {
    return failure('NOT_FOUND', '题目不存在或已下架');
  }

  return success(question);
}
