import cloud from 'wx-server-sdk';
import { gradeObjectiveAnswer } from '../common/objective-grading';
import { failure, success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

export async function main(event: { questionId?: string; userAnswer?: string[]; durationSeconds?: number }) {
  const openid = cloud.getWXContext().OPENID;

  if (!event.questionId || !Array.isArray(event.userAnswer)) {
    return failure('INVALID_PARAMS', '参数不完整');
  }

  const questionResult = await db.collection('questions').doc(event.questionId).get();
  const question = questionResult.data;

  if (!question || question.status !== 'published') {
    return failure('NOT_FOUND', '题目不存在或已下架');
  }

  if (question.type === 'subjective') {
    return failure('INVALID_PARAMS', '综合题请调用 AI 判分接口');
  }

  const grading = gradeObjectiveAnswer({
    questionId: event.questionId,
    questionType: question.type,
    correctAnswer: question.answer,
    userAnswer: event.userAnswer,
    maxScore: question.score || 1
  });

  await db.collection('user_answers').add({
    data: {
      openid,
      questionId: event.questionId,
      questionType: question.type,
      userAnswer: grading.userAnswer,
      isCorrect: grading.isCorrect,
      score: grading.score,
      maxScore: grading.maxScore,
      durationSeconds: event.durationSeconds || 0,
      createdAt: new Date()
    }
  });

  return success(grading);
}
