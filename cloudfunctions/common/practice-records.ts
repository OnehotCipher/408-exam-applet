import type { ObjectiveQuestionType, PracticeStats, WrongQuestionRecord } from '@study408/shared';

interface BuildWrongQuestionRecordInput {
  openid: string;
  questionId: string;
  questionType: ObjectiveQuestionType;
  now: Date;
}

interface AnswerForStats {
  subjectId: string;
  chapterId: string;
  isCorrect: boolean;
}

interface SummarizePracticeStatsInput {
  answers: AnswerForStats[];
  wrongQuestionCount: number;
  favoriteQuestionCount: number;
}

export function buildWrongQuestionRecord(input: BuildWrongQuestionRecordInput): WrongQuestionRecord {
  return {
    openid: input.openid,
    questionId: input.questionId,
    questionType: input.questionType,
    status: 'unresolved',
    wrongCount: 1,
    lastWrongAt: input.now,
    updatedAt: input.now
  };
}

export function calculateAccuracy(correctAnswered: number, totalAnswered: number): number {
  if (totalAnswered === 0) return 0;
  return Math.round((correctAnswered / totalAnswered) * 100) / 100;
}

export function summarizePracticeStats(input: SummarizePracticeStatsInput): PracticeStats {
  const totalAnswered = input.answers.length;
  const correctAnswered = input.answers.filter((answer) => answer.isCorrect).length;
  const subjectMap = new Map<string, { subjectId: string; totalAnswered: number; correctAnswered: number }>();
  const chapterMap = new Map<string, { subjectId: string; chapterId: string; totalAnswered: number; correctAnswered: number }>();

  for (const answer of input.answers) {
    const subject = subjectMap.get(answer.subjectId) || { subjectId: answer.subjectId, totalAnswered: 0, correctAnswered: 0 };
    subject.totalAnswered += 1;
    if (answer.isCorrect) subject.correctAnswered += 1;
    subjectMap.set(answer.subjectId, subject);

    const chapterKey = `${answer.subjectId}:${answer.chapterId}`;
    const chapter = chapterMap.get(chapterKey) || { subjectId: answer.subjectId, chapterId: answer.chapterId, totalAnswered: 0, correctAnswered: 0 };
    chapter.totalAnswered += 1;
    if (answer.isCorrect) chapter.correctAnswered += 1;
    chapterMap.set(chapterKey, chapter);
  }

  return {
    totalAnswered,
    correctAnswered,
    accuracy: calculateAccuracy(correctAnswered, totalAnswered),
    wrongQuestionCount: input.wrongQuestionCount,
    favoriteQuestionCount: input.favoriteQuestionCount,
    subjects: Array.from(subjectMap.values()).map((item) => ({ ...item, accuracy: calculateAccuracy(item.correctAnswered, item.totalAnswered) })),
    chapters: Array.from(chapterMap.values()).map((item) => ({ ...item, accuracy: calculateAccuracy(item.correctAnswered, item.totalAnswered) }))
  };
}
