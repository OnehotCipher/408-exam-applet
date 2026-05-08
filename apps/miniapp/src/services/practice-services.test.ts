import { describe, expect, it, vi } from 'vitest';
import { getCategories } from './category.service';
import { toggleFavoriteQuestion } from './favorite.service';
import { getPracticeStats } from './stats.service';
import { getWrongQuestions, updateWrongQuestionStatus } from './wrong-question.service';
import { getQuestionDetail, getQuestionList } from './question.service';
import { submitAnswer } from './answer.service';

function createCloud(data: unknown) {
  return { callFunction: vi.fn().mockResolvedValue({ result: { success: true, data } }) };
}

describe('practice services', () => {
  it('calls getCategories with filters', async () => {
    const cloud = createCloud({ items: [] });
    await getCategories(cloud, { type: 'chapter', parentId: 'data-structure' });
    expect(cloud.callFunction).toHaveBeenCalledWith({ name: 'getCategories', data: { type: 'chapter', parentId: 'data-structure' } });
  });

  it('calls question list and detail functions', async () => {
    const cloud = createCloud({ items: [], total: 0, page: 1, pageSize: 10 });
    await getQuestionList(cloud, { subjectId: 'data-structure', chapterId: 'ds-linear-list', page: 1, pageSize: 10 });
    expect(cloud.callFunction).toHaveBeenCalledWith({ name: 'getQuestionList', data: { subjectId: 'data-structure', chapterId: 'ds-linear-list', page: 1, pageSize: 10 } });

    const detailCloud = createCloud({ _id: 'q1' });
    await getQuestionDetail(detailCloud, 'q1');
    expect(detailCloud.callFunction).toHaveBeenCalledWith({ name: 'getQuestionDetail', data: { questionId: 'q1' } });
  });

  it('calls favorite, wrong question and stats functions', async () => {
    const cloud = createCloud({});
    await toggleFavoriteQuestion(cloud, 'q1');
    await getWrongQuestions(cloud, { status: 'unresolved' });
    await updateWrongQuestionStatus(cloud, { questionId: 'q1', status: 'resolved' });
    await getPracticeStats(cloud);

    expect(cloud.callFunction).toHaveBeenNthCalledWith(1, { name: 'toggleFavoriteQuestion', data: { questionId: 'q1' } });
    expect(cloud.callFunction).toHaveBeenNthCalledWith(2, { name: 'getWrongQuestions', data: { status: 'unresolved' } });
    expect(cloud.callFunction).toHaveBeenNthCalledWith(3, { name: 'updateWrongQuestionStatus', data: { questionId: 'q1', status: 'resolved' } });
    expect(cloud.callFunction).toHaveBeenNthCalledWith(4, { name: 'getPracticeStats', data: undefined });
  });

  it('calls submitAnswer with question id, answer and duration', async () => {
    const cloud = createCloud({ questionId: 'q1', isCorrect: true });
    await submitAnswer(cloud, { questionId: 'q1', userAnswer: ['A'], durationSeconds: 12 });

    expect(cloud.callFunction).toHaveBeenCalledWith({
      name: 'submitAnswer',
      data: { questionId: 'q1', userAnswer: ['A'], durationSeconds: 12 }
    });
  });
});
