# 考研 408 答题小程序 Phase 1 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 建立项目基础设施，并完成「题目数据类型 + 客观题判分 + 小程序页面骨架 + 核心云函数」的第一阶段闭环。

**架构：** 使用 monorepo 组织 `apps/miniapp`、`cloudfunctions` 和 `packages/shared`。共享类型包定义题目、答案和 API 响应结构；云函数公共模块实现客观题判分；小程序端通过服务层调用云函数，页面只负责展示和交互。

**技术栈：** pnpm workspace、TypeScript、Vitest、uni-app、Vue 3、微信云开发 Node.js 云函数。

---

## 范围

本计划只覆盖第一阶段：工程基础、共享类型、客观题判分、小程序基础页面和核心题目云函数。

本计划不实现：Web 管理后台、综合题 AI 判分、微信上线配置、题库批量导入、模拟考试、支付会员和社区能力。

---

## 文件结构

### 创建根目录文件

- 创建：`package.json` — 根工作区脚本。
- 创建：`pnpm-workspace.yaml` — workspace 配置。
- 创建：`tsconfig.base.json` — TypeScript 公共配置。
- 创建：`.gitignore` — 忽略依赖、产物和环境变量。
- 创建：`.env.example` — 环境变量示例。

### 创建共享类型包

- 创建：`packages/shared/package.json`
- 创建：`packages/shared/tsconfig.json`
- 创建：`packages/shared/src/api.ts`
- 创建：`packages/shared/src/question.ts`
- 创建：`packages/shared/src/answer.ts`
- 创建：`packages/shared/src/category.ts`
- 创建：`packages/shared/src/user.ts`
- 创建：`packages/shared/src/index.ts`
- 创建：`packages/shared/src/question.test.ts`

### 创建云函数公共模块

- 创建：`cloudfunctions/common/package.json`
- 创建：`cloudfunctions/common/tsconfig.json`
- 创建：`cloudfunctions/common/response.ts`
- 创建：`cloudfunctions/common/objective-grading.ts`
- 创建：`cloudfunctions/common/objective-grading.test.ts`

### 创建小程序端基础文件

- 创建：`apps/miniapp/package.json`
- 创建：`apps/miniapp/tsconfig.json`
- 创建：`apps/miniapp/src/main.ts`
- 创建：`apps/miniapp/src/App.vue`
- 创建：`apps/miniapp/src/pages.json`
- 创建：`apps/miniapp/src/manifest.json`
- 创建：`apps/miniapp/src/services/cloud.ts`
- 创建：`apps/miniapp/src/services/question.service.ts`
- 创建：`apps/miniapp/src/services/answer.service.ts`
- 创建：`apps/miniapp/src/pages/home/index.vue`
- 创建：`apps/miniapp/src/pages/subjects/index.vue`
- 创建：`apps/miniapp/src/pages/practice/index.vue`

### 创建核心云函数

- 创建：`cloudfunctions/login/package.json`
- 创建：`cloudfunctions/login/index.ts`
- 创建：`cloudfunctions/getQuestionList/package.json`
- 创建：`cloudfunctions/getQuestionList/index.ts`
- 创建：`cloudfunctions/getQuestionDetail/package.json`
- 创建：`cloudfunctions/getQuestionDetail/index.ts`
- 创建：`cloudfunctions/submitAnswer/package.json`
- 创建：`cloudfunctions/submitAnswer/index.ts`

---

## 任务 1：初始化 workspace

**文件：**

- 创建：`package.json`
- 创建：`pnpm-workspace.yaml`
- 创建：`tsconfig.base.json`
- 创建：`.gitignore`
- 创建：`.env.example`

- [ ] **步骤 1：确认工作目录**

运行：

```powershell
Get-Location
```

预期：输出路径为 `D:\AiStudy\07studyfor408`。

- [ ] **步骤 2：初始化 Git 仓库**

运行：

```powershell
git rev-parse --is-inside-work-tree
```

如果输出 `true`，继续下一步。如果输出 `fatal: not a git repository`，运行：

```powershell
git init
```

预期：Git 仓库可用。

- [ ] **步骤 3：创建根配置文件**

写入：`package.json`

```json
{
  "name": "study-408-mini-program",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test",
    "build": "pnpm -r build"
  },
  "devDependencies": {
    "@types/node": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

写入：`pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "cloudfunctions/*"
```

写入：`tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@study408/shared": ["packages/shared/src/index.ts"],
      "@study408/shared/*": ["packages/shared/src/*"]
    }
  }
}
```

写入：`.gitignore`

```gitignore
node_modules/
dist/
build/
coverage/
.env
.env.*
!.env.example
unpackage/
cloudfunctions/**/node_modules/
cloudfunctions/**/dist/
```

写入：`.env.example`

```env
WECHAT_CLOUD_ENV_ID=
WECHAT_APP_ID=
DEEPSEEK_API_KEY=
ADMIN_TOKEN_SECRET=
ADMIN_TOKEN_EXPIRES_IN=7d
```

- [ ] **步骤 4：安装依赖**

运行：

```powershell
pnpm install
```

预期：生成 `pnpm-lock.yaml`，命令退出码为 0。

- [ ] **步骤 5：提交变更**

运行：

```powershell
git add package.json pnpm-workspace.yaml tsconfig.base.json .gitignore .env.example pnpm-lock.yaml
git commit -m "chore: initialize workspace"
```

预期：提交成功。

---

## 任务 2：创建共享类型包

**文件：**

- 创建：`packages/shared/package.json`
- 创建：`packages/shared/tsconfig.json`
- 创建：`packages/shared/src/api.ts`
- 创建：`packages/shared/src/question.ts`
- 创建：`packages/shared/src/answer.ts`
- 创建：`packages/shared/src/category.ts`
- 创建：`packages/shared/src/user.ts`
- 创建：`packages/shared/src/index.ts`
- 创建：`packages/shared/src/question.test.ts`

- [ ] **步骤 1：创建共享包配置**

写入：`packages/shared/package.json`

```json
{
  "name": "@study408/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

写入：`packages/shared/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **步骤 2：编写失败测试**

写入：`packages/shared/src/question.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { normalizeAnswerKeys } from './question';

describe('normalizeAnswerKeys', () => {
  it('uppercases, deduplicates and sorts keys', () => {
    expect(normalizeAnswerKeys(['b', 'A', 'a'])).toEqual(['A', 'B']);
  });
});
```

- [ ] **步骤 3：运行测试验证失败**

运行：

```powershell
pnpm --filter @study408/shared test
```

预期：FAIL，错误包含 `Cannot find module './question'`。

- [ ] **步骤 4：实现共享类型**

写入：`packages/shared/src/question.ts`

```ts
export type QuestionType = 'single_choice' | 'multiple_choice' | 'subjective';
export type QuestionStatus = 'draft' | 'published' | 'disabled';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  _id: string;
  type: QuestionType;
  subjectId: string;
  chapterId: string;
  knowledgePointIds: string[];
  stem: string;
  options: QuestionOption[];
  answer: string[];
  analysis: string;
  referenceAnswer?: string;
  gradingRubric?: string;
  score: number;
  difficulty: Difficulty;
  year?: number;
  source?: string;
  status: QuestionStatus;
}

export function normalizeAnswerKeys(keys: string[]): string[] {
  return Array.from(new Set(keys.map((key) => key.trim().toUpperCase()))).sort();
}
```

写入：`packages/shared/src/answer.ts`

```ts
import type { QuestionType } from './question';

export type WrongQuestionStatus = 'unresolved' | 'reviewing' | 'resolved';

export interface ObjectiveGradingResult {
  questionId: string;
  questionType: Exclude<QuestionType, 'subjective'>;
  userAnswer: string[];
  correctAnswer: string[];
  isCorrect: boolean;
  score: number;
  maxScore: number;
}
```

写入：`packages/shared/src/category.ts`

```ts
export type CategoryType = 'subject' | 'chapter' | 'knowledge_point';

export interface Category {
  _id: string;
  type: CategoryType;
  name: string;
  parentId: string | null;
  sortOrder: number;
  enabled: boolean;
}
```

写入：`packages/shared/src/user.ts`

```ts
export interface UserProfile {
  _id: string;
  openid: string;
  nickname?: string;
  avatarUrl?: string;
}
```

写入：`packages/shared/src/api.ts`

```ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

写入：`packages/shared/src/index.ts`

```ts
export * from './api';
export * from './answer';
export * from './category';
export * from './question';
export * from './user';
```

- [ ] **步骤 5：验证共享包**

运行：

```powershell
pnpm --filter @study408/shared test
pnpm --filter @study408/shared typecheck
```

预期：全部 PASS。

- [ ] **步骤 6：提交变更**

运行：

```powershell
git add packages/shared
git commit -m "feat: add shared domain types"
```

预期：提交成功。

---

## 任务 3：实现云函数公共判分模块

**文件：**

- 创建：`cloudfunctions/common/package.json`
- 创建：`cloudfunctions/common/tsconfig.json`
- 创建：`cloudfunctions/common/response.ts`
- 创建：`cloudfunctions/common/objective-grading.ts`
- 创建：`cloudfunctions/common/objective-grading.test.ts`

- [ ] **步骤 1：创建公共模块配置**

写入：`cloudfunctions/common/package.json`

```json
{
  "name": "@study408/cloud-common",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "tsc --noEmit"
  },
  "dependencies": {
    "@study408/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

写入：`cloudfunctions/common/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["vitest/globals"]
  },
  "include": ["*.ts"]
}
```

- [ ] **步骤 2：编写失败测试**

写入：`cloudfunctions/common/objective-grading.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { gradeObjectiveAnswer } from './objective-grading';

describe('gradeObjectiveAnswer', () => {
  it('marks single choice correct when normalized answer matches', () => {
    const result = gradeObjectiveAnswer({
      questionId: 'q1',
      questionType: 'single_choice',
      correctAnswer: ['A'],
      userAnswer: ['a'],
      maxScore: 2
    });

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(2);
  });

  it('marks multiple choice wrong when answer set differs', () => {
    const result = gradeObjectiveAnswer({
      questionId: 'q2',
      questionType: 'multiple_choice',
      correctAnswer: ['A', 'C'],
      userAnswer: ['A'],
      maxScore: 2
    });

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(0);
  });
});
```

- [ ] **步骤 3：运行测试验证失败**

运行：

```powershell
pnpm --filter @study408/cloud-common test
```

预期：FAIL，错误包含 `Cannot find module './objective-grading'`。

- [ ] **步骤 4：实现判分模块**

写入：`cloudfunctions/common/objective-grading.ts`

```ts
import { normalizeAnswerKeys, type QuestionType } from '@study408/shared';

export interface GradeObjectiveAnswerInput {
  questionId: string;
  questionType: Exclude<QuestionType, 'subjective'>;
  correctAnswer: string[];
  userAnswer: string[];
  maxScore: number;
}

export function gradeObjectiveAnswer(input: GradeObjectiveAnswerInput) {
  const correctAnswer = normalizeAnswerKeys(input.correctAnswer);
  const userAnswer = normalizeAnswerKeys(input.userAnswer);
  const isCorrect = correctAnswer.length === userAnswer.length && correctAnswer.every((key, index) => key === userAnswer[index]);

  return {
    questionId: input.questionId,
    questionType: input.questionType,
    userAnswer,
    correctAnswer,
    isCorrect,
    score: isCorrect ? input.maxScore : 0,
    maxScore: input.maxScore
  };
}
```

写入：`cloudfunctions/common/response.ts`

```ts
import type { ApiResponse } from '@study408/shared';

export function success<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function failure<T = never>(code: string, message: string): ApiResponse<T> {
  return { success: false, error: { code, message } };
}
```

- [ ] **步骤 5：验证公共模块**

运行：

```powershell
pnpm --filter @study408/cloud-common test
pnpm --filter @study408/cloud-common typecheck
```

预期：全部 PASS。

- [ ] **步骤 6：提交变更**

运行：

```powershell
git add cloudfunctions/common
git commit -m "feat: add objective grading utilities"
```

预期：提交成功。

---

## 任务 4：创建小程序端基础骨架

**文件：**

- 创建：`apps/miniapp/package.json`
- 创建：`apps/miniapp/tsconfig.json`
- 创建：`apps/miniapp/src/main.ts`
- 创建：`apps/miniapp/src/App.vue`
- 创建：`apps/miniapp/src/pages.json`
- 创建：`apps/miniapp/src/manifest.json`
- 创建：`apps/miniapp/src/services/cloud.ts`
- 创建：`apps/miniapp/src/services/question.service.ts`
- 创建：`apps/miniapp/src/services/answer.service.ts`
- 创建：`apps/miniapp/src/pages/home/index.vue`
- 创建：`apps/miniapp/src/pages/subjects/index.vue`
- 创建：`apps/miniapp/src/pages/practice/index.vue`

- [ ] **步骤 1：创建小程序包配置**

写入：`apps/miniapp/package.json`

```json
{
  "name": "@study408/miniapp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:mp-weixin": "uni -p mp-weixin",
    "build:mp-weixin": "uni build -p mp-weixin",
    "typecheck": "vue-tsc --noEmit",
    "test": "vitest run",
    "build": "uni build -p mp-weixin"
  },
  "dependencies": {
    "@dcloudio/uni-app": "latest",
    "@dcloudio/uni-components": "latest",
    "@study408/shared": "workspace:*",
    "pinia": "latest",
    "vue": "latest"
  },
  "devDependencies": {
    "@dcloudio/types": "latest",
    "@dcloudio/vite-plugin-uni": "latest",
    "typescript": "latest",
    "vite": "latest",
    "vitest": "latest",
    "vue-tsc": "latest"
  }
}
```

写入：`apps/miniapp/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["@dcloudio/types", "vitest/globals"]
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "src/**/*.json"]
}
```

- [ ] **步骤 2：创建入口文件**

写入：`apps/miniapp/src/main.ts`

```ts
import { createSSRApp } from 'vue';
import App from './App.vue';

export function createApp() {
  const app = createSSRApp(App);
  return { app };
}
```

写入：`apps/miniapp/src/App.vue`

```vue
<script setup lang="ts">
</script>

<style>
page {
  background: #f6f7fb;
  color: #1f2937;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
}
</style>
```

- [ ] **步骤 3：创建页面配置**

写入：`apps/miniapp/src/pages.json`

```json
{
  "pages": [
    { "path": "pages/home/index", "style": { "navigationBarTitleText": "408 刷题" } },
    { "path": "pages/subjects/index", "style": { "navigationBarTitleText": "选择科目" } },
    { "path": "pages/practice/index", "style": { "navigationBarTitleText": "开始答题" } }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "408 刷题",
    "navigationBarBackgroundColor": "#ffffff",
    "backgroundColor": "#f6f7fb"
  }
}
```

写入：`apps/miniapp/src/manifest.json`

```json
{
  "name": "考研 408 答题",
  "appid": "",
  "description": "考研 408 刷题训练小程序",
  "versionName": "0.1.0",
  "versionCode": "1",
  "mp-weixin": {
    "appid": "",
    "usingComponents": true
  }
}
```

- [ ] **步骤 4：创建服务层**

写入：`apps/miniapp/src/services/cloud.ts`

```ts
import type { ApiResponse } from '@study408/shared';

interface CloudLike {
  callFunction(input: { name: string; data?: unknown }): Promise<{ result?: unknown }>;
}

export async function callCloudFunction<T>(cloud: CloudLike, name: string, data?: unknown): Promise<T> {
  const response = await cloud.callFunction({ name, data });
  const result = response.result as ApiResponse<T> | undefined;

  if (!result) throw new Error('云函数无返回结果');
  if (!result.success) throw new Error(result.error?.message || '云函数调用失败');

  return result.data as T;
}
```

写入：`apps/miniapp/src/services/question.service.ts`

```ts
import type { Question } from '@study408/shared';
import { callCloudFunction } from './cloud';

interface CloudLike {
  callFunction(input: { name: string; data?: unknown }): Promise<{ result?: unknown }>;
}

export function getQuestionList(cloud: CloudLike, params: { subjectId?: string; chapterId?: string }) {
  return callCloudFunction<{ items: Question[]; total: number }>(cloud, 'getQuestionList', params);
}
```

写入：`apps/miniapp/src/services/answer.service.ts`

```ts
import type { ObjectiveGradingResult } from '@study408/shared';
import { callCloudFunction } from './cloud';

interface CloudLike {
  callFunction(input: { name: string; data?: unknown }): Promise<{ result?: unknown }>;
}

export function submitAnswer(cloud: CloudLike, params: { questionId: string; userAnswer: string[]; durationSeconds: number }) {
  return callCloudFunction<ObjectiveGradingResult>(cloud, 'submitAnswer', params);
}
```

- [ ] **步骤 5：创建页面骨架**

写入：`apps/miniapp/src/pages/home/index.vue`

```vue
<template>
  <view class="page">
    <text class="title">考研 408 刷题</text>
    <navigator class="button" url="/pages/subjects/index">开始刷题</navigator>
  </view>
</template>

<style scoped>
.page { padding: 32rpx; }
.title { display: block; font-size: 44rpx; font-weight: 700; }
.button { display: block; margin-top: 32rpx; padding: 28rpx; border-radius: 20rpx; background: #2563eb; color: #ffffff; text-align: center; }
</style>
```

写入：`apps/miniapp/src/pages/subjects/index.vue`

```vue
<template>
  <view class="page">
    <navigator v-for="subject in subjects" :key="subject.id" class="card" :url="`/pages/practice/index?subjectId=${subject.id}`">
      {{ subject.name }}
    </navigator>
  </view>
</template>

<script setup lang="ts">
const subjects = [
  { id: 'data-structure', name: '数据结构' },
  { id: 'computer-organization', name: '计算机组成原理' },
  { id: 'operating-system', name: '操作系统' },
  { id: 'computer-network', name: '计算机网络' }
];
</script>

<style scoped>
.page { padding: 32rpx; }
.card { display: block; margin-bottom: 24rpx; padding: 32rpx; border-radius: 20rpx; background: #ffffff; }
</style>
```

写入：`apps/miniapp/src/pages/practice/index.vue`

```vue
<template>
  <view class="page">
    <text class="title">开始答题</text>
    <text class="desc">第一阶段先接入客观题刷题闭环。</text>
  </view>
</template>

<style scoped>
.page { padding: 32rpx; }
.title { display: block; font-size: 36rpx; font-weight: 700; }
.desc { display: block; margin-top: 16rpx; color: #64748b; }
</style>
```

- [ ] **步骤 6：验证小程序类型**

运行：

```powershell
pnpm --filter @study408/miniapp typecheck
```

预期：PASS。

- [ ] **步骤 7：提交变更**

运行：

```powershell
git add apps/miniapp
git commit -m "feat: scaffold miniapp foundation"
```

预期：提交成功。

---

## 任务 5：实现核心题目云函数

**文件：**

- 创建：`cloudfunctions/login/package.json`
- 创建：`cloudfunctions/login/index.ts`
- 创建：`cloudfunctions/getQuestionList/package.json`
- 创建：`cloudfunctions/getQuestionList/index.ts`
- 创建：`cloudfunctions/getQuestionDetail/package.json`
- 创建：`cloudfunctions/getQuestionDetail/index.ts`
- 创建：`cloudfunctions/submitAnswer/package.json`
- 创建：`cloudfunctions/submitAnswer/index.ts`

- [ ] **步骤 1：创建云函数依赖配置**

每个云函数目录写入对应 `package.json`。以 `cloudfunctions/submitAnswer/package.json` 为例：

```json
{
  "name": "submit-answer",
  "version": "0.1.0",
  "private": true,
  "main": "index.js",
  "dependencies": {
    "@study408/shared": "workspace:*",
    "@study408/cloud-common": "workspace:*",
    "wx-server-sdk": "latest"
  }
}
```

`login`、`getQuestionList` 和 `getQuestionDetail` 使用相同依赖结构，将 `name` 分别改为 `login`、`get-question-list`、`get-question-detail`。

- [ ] **步骤 2：实现登录云函数**

写入：`cloudfunctions/login/index.ts`

```ts
import cloud from 'wx-server-sdk';
import { success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

export async function main() {
  const openid = cloud.getWXContext().OPENID;
  const now = new Date();
  const existing = await db.collection('users').where({ openid }).limit(1).get();

  if (existing.data.length === 0) {
    await db.collection('users').add({ data: { openid, createdAt: now, updatedAt: now, lastLoginAt: now } });
  } else {
    await db.collection('users').doc(existing.data[0]._id).update({ data: { updatedAt: now, lastLoginAt: now } });
  }

  return success({ openid });
}
```

- [ ] **步骤 3：实现题目列表云函数**

写入：`cloudfunctions/getQuestionList/index.ts`

```ts
import cloud from 'wx-server-sdk';
import { success } from '../common/response';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

export async function main(event: { subjectId?: string; chapterId?: string; page?: number; pageSize?: number }) {
  const page = Math.max(Number(event.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(event.pageSize || 10), 1), 50);
  const where: Record<string, unknown> = { status: 'published' };

  if (event.subjectId) where.subjectId = event.subjectId;
  if (event.chapterId) where.chapterId = event.chapterId;

  const query = db.collection('questions').where(where);
  const [items, count] = await Promise.all([
    query.skip((page - 1) * pageSize).limit(pageSize).get(),
    query.count()
  ]);

  return success({ items: items.data, total: count.total });
}
```

- [ ] **步骤 4：实现题目详情云函数**

写入：`cloudfunctions/getQuestionDetail/index.ts`

```ts
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
```

- [ ] **步骤 5：实现客观题提交云函数**

写入：`cloudfunctions/submitAnswer/index.ts`

```ts
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
```

- [ ] **步骤 6：验证可测试模块**

运行：

```powershell
pnpm --filter @study408/cloud-common test
pnpm --filter @study408/cloud-common typecheck
```

预期：全部 PASS。

- [ ] **步骤 7：提交变更**

运行：

```powershell
git add cloudfunctions
git commit -m "feat: add core question cloud functions"
```

预期：提交成功。

---

## 任务 6：第一阶段整体验证

**文件：**

- 检查：`docs/prd/408-exam-answer-mini-program-prd.md`
- 检查：`docs/design/408-exam-answer-mini-program-technical-design.md`
- 检查：`packages/shared/src/index.ts`
- 检查：`cloudfunctions/common/objective-grading.ts`
- 检查：`apps/miniapp/src/pages.json`

- [ ] **步骤 1：运行全部单元测试**

运行：

```powershell
pnpm test
```

预期：共享类型包和云函数公共模块测试通过。

- [ ] **步骤 2：运行全部类型检查**

运行：

```powershell
pnpm typecheck
```

预期：所有 workspace 类型检查通过。

- [ ] **步骤 3：构建小程序微信端产物**

运行：

```powershell
pnpm --filter @study408/miniapp build:mp-weixin
```

预期：生成 `apps/miniapp/dist/build/mp-weixin` 或 uni-app 当前版本对应的微信小程序产物目录。

- [ ] **步骤 4：检查 Git 状态**

运行：

```powershell
git status --short
```

预期：没有未提交变更。

- [ ] **步骤 5：记录阶段完成结论**

在执行报告中写明：

```text
Phase 1 已完成：workspace、共享类型、客观题判分、小程序页面骨架和核心题目云函数已建立；测试、类型检查和小程序构建已通过。
```

---

## 执行方式

计划已拆成 6 个任务。推荐使用子代理驱动执行，每个任务完成后进行一次审查。若在当前会话中执行，应使用 `executing-plans` 技能按任务顺序执行，并在任务 3 和任务 6 后暂停确认。
