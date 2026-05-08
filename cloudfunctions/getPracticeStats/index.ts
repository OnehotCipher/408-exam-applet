import cloud from 'wx-server-sdk';
import { summarizePracticeStats } from '../common/practice-records';
import { success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

export async function main() {
  const openid = cloud.getWXContext().OPENID;
  const [answers, wrongCount, favoriteCount] = await Promise.all([
    db.collection('user_answers').where({ openid }).limit(1000).get(),
    db.collection('wrong_questions').where({ openid }).count(),
    db.collection('favorite_questions').where({ openid }).count()
  ]);

  const stats = summarizePracticeStats({
    answers: answers.data.map((answer) => ({
      subjectId: answer.subjectId,
      chapterId: answer.chapterId,
      isCorrect: answer.isCorrect
    })),
    wrongQuestionCount: wrongCount.total,
    favoriteQuestionCount: favoriteCount.total
  });

  return success(stats);
}
