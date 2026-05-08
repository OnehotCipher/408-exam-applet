import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readJson(path) {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf-8'));
}

const manifest = readJson('data/seeds/seed-manifest.json');
const categories = readJson(manifest.categoryFile);
const questions = manifest.questionFiles.flatMap((file) => readJson(file));
const categoryIds = new Set(categories.map((category) => category._id));
const errors = [];

for (const category of categories) {
  if (category.parentId && !categoryIds.has(category.parentId)) {
    errors.push(`分类 ${category._id} 引用了不存在的 parentId: ${category.parentId}`);
  }
}

for (const question of questions) {
  if (!categoryIds.has(question.subjectId)) errors.push(`题目 ${question._id} 引用了不存在的 subjectId: ${question.subjectId}`);
  if (!categoryIds.has(question.chapterId)) errors.push(`题目 ${question._id} 引用了不存在的 chapterId: ${question.chapterId}`);

  for (const knowledgePointId of question.knowledgePointIds) {
    if (!categoryIds.has(knowledgePointId)) errors.push(`题目 ${question._id} 引用了不存在的 knowledgePointId: ${knowledgePointId}`);
  }

  const optionKeys = new Set(question.options.map((option) => option.key));
  for (const answerKey of question.answer) {
    if (!optionKeys.has(answerKey)) errors.push(`题目 ${question._id} 的答案 ${answerKey} 不存在于选项中`);
  }

  if (question.type === 'single_choice' && question.answer.length !== 1) errors.push(`题目 ${question._id} 是单选题但答案数量不是 1`);
  if (question.type === 'multiple_choice' && question.answer.length < 2) errors.push(`题目 ${question._id} 是多选题但答案数量小于 2`);
  if (question.type === 'subjective') errors.push(`题目 ${question._id} 是主观题，Phase 2 种子数据只允许客观题`);
}

if (questions.length < manifest.minimumQuestionCount) {
  errors.push(`题目数量 ${questions.length} 小于 manifest 要求的 ${manifest.minimumQuestionCount}`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Seed data valid: ${categories.length} categories, ${questions.length} questions`);
