# 考研 408 答题小程序技术设计文档 v1.0

## 文档信息

| 项目 | 内容 |
|------|------|
| 产品 | 考研 408 答题小程序 |
| 关联 PRD | `docs/prd/408-exam-answer-mini-program-prd.md` |
| 文档版本 | v1.0 |
| 创建日期 | 2026-05-06 |
| 技术路线 | uni-app + Vue 3 + TypeScript + 微信云开发 + Web 管理后台 |
| 开发方式 | Windsurf 内完成源码开发，微信开发者工具负责预览、真机调试、上传和审核 |

## 1. 技术目标

首版技术目标是构建一套可上线的 MVP 工程，覆盖小程序端、微信云函数、云数据库和 Web 管理后台。

核心闭环如下：

```text
管理员录题 → 云数据库保存题目 → 小程序读取题目 → 用户作答 → 云函数判分 → 保存答题记录 → 展示解析/错题/收藏/统计
```

技术设计重点：

- **可在 Windsurf 中开发：** 使用源码工程和 CLI 工具，避免依赖 HBuilderX 独占流程。
- **面向微信小程序上线：** 使用 uni-app 编译到微信小程序，最终导入微信开发者工具。
- **云端逻辑集中：** 用户身份、题目查询、答案提交、AI 判分和后台管理通过微信云函数处理。
- **AI Key 安全：** 小程序端和 Web 管理后台不保存模型 API Key，统一放在云函数环境变量。
- **模块边界清晰：** 小程序端、管理后台、云函数、共享类型分层设计。

## 2. 总体架构

### 2.1 架构图

```text
┌──────────────────────────────┐
│ 微信小程序端                   │
│ uni-app + Vue 3 + TypeScript  │
│                              │
│ 首页 / 章节 / 答题 / 解析 / 复盘 │
└───────────────┬──────────────┘
                │ wx.cloud.callFunction
                ▼
┌──────────────────────────────┐
│ 微信云函数层                   │
│ Node.js + TypeScript          │
│                              │
│ login / question / answer     │
│ favorite / stats / aiGrading  │
└───────────────┬──────────────┘
                │ db.collection
                ▼
┌──────────────────────────────┐
│ 微信云数据库                   │
│                              │
│ users / categories / questions│
│ user_answers / wrong_questions│
│ favorites / ai_grading_records│
└──────────────────────────────┘

┌──────────────────────────────┐
│ Web 管理后台                   │
│ Vue 3 + TypeScript + Vite     │
│                              │
│ 登录 / 题目管理 / 分类管理      │
└───────────────┬──────────────┘
                │ HTTPS / 云函数 HTTP 入口或 callFunction 适配
                ▼
┌──────────────────────────────┐
│ 管理后台云函数                 │
│ adminAuth / adminQuestion     │
│ adminCategory                 │
└──────────────────────────────┘
```

### 2.2 子系统边界

| 子系统 | 职责 | 不负责 |
|--------|------|--------|
| 小程序端 | 用户刷题、查看解析、错题/收藏/统计展示 | 直接访问 AI API、直接管理题库 |
| Web 管理后台 | 管理员录题、编辑题目、维护分类 | 普通用户刷题体验 |
| 云函数 | 身份识别、业务校验、数据库读写、AI 判分 | UI 展示 |
| 云数据库 | 持久化题目、用户、答题、错题、收藏和判分记录 | 复杂业务计算 |
| AI 模型适配层 | 屏蔽 DeepSeek 等模型差异，返回统一判分结构 | 保存用户界面状态 |
| 共享类型层 | 统一前后端数据类型、枚举和接口结构 | 具体 UI 或数据库操作 |

## 3. 推荐工程结构

首版采用一个仓库内多目录结构，便于在 Windsurf 中集中开发。

```text
07studyfor408
├─ docs
│  ├─ prd
│  │  └─ 408-exam-answer-mini-program-prd.md
│  └─ design
│     └─ 408-exam-answer-mini-program-technical-design.md
├─ apps
│  ├─ miniapp
│  │  ├─ src
│  │  │  ├─ pages
│  │  │  ├─ components
│  │  │  ├─ services
│  │  │  ├─ stores
│  │  │  ├─ types
│  │  │  ├─ utils
│  │  │  ├─ App.vue
│  │  │  ├─ main.ts
│  │  │  ├─ manifest.json
│  │  │  └─ pages.json
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  └─ vite.config.ts
│  └─ admin
│     ├─ src
│     │  ├─ pages
│     │  ├─ components
│     │  ├─ services
│     │  ├─ stores
│     │  ├─ router
│     │  ├─ types
│     │  ├─ utils
│     │  ├─ App.vue
│     │  └─ main.ts
│     ├─ package.json
│     ├─ tsconfig.json
│     └─ vite.config.ts
├─ cloudfunctions
│  ├─ common
│  │  ├─ db.ts
│  │  ├─ response.ts
│  │  ├─ validators.ts
│  │  └─ types.ts
│  ├─ login
│  ├─ getQuestionList
│  ├─ getQuestionDetail
│  ├─ submitAnswer
│  ├─ gradeSubjectiveAnswer
│  ├─ toggleFavorite
│  ├─ getWrongQuestions
│  ├─ getStudyStats
│  ├─ adminAuth
│  ├─ adminQuestionManage
│  └─ adminCategoryManage
├─ packages
│  └─ shared
│     ├─ src
│     │  ├─ constants.ts
│     │  ├─ question.ts
│     │  ├─ answer.ts
│     │  ├─ category.ts
│     │  ├─ user.ts
│     │  └─ index.ts
│     ├─ package.json
│     └─ tsconfig.json
├─ package.json
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
```

### 3.1 结构选择说明

- `apps/miniapp`：小程序端源码，使用 uni-app Vue 3 CLI 工程。
- `apps/admin`：独立 Web 管理后台，使用 Vite + Vue 3 + TypeScript。
- `cloudfunctions`：微信云函数目录，每个云函数独立部署。
- `packages/shared`：共享类型和枚举，减少小程序端、后台和云函数之间的数据结构漂移。
- `docs`：产品、技术设计和实现计划文档。

## 4. 小程序端设计

### 4.1 页面路由

```json
{
  "pages": [
    "pages/home/index",
    "pages/subjects/index",
    "pages/chapters/index",
    "pages/practice/index",
    "pages/result/index",
    "pages/wrong/index",
    "pages/favorites/index",
    "pages/stats/index",
    "pages/profile/index"
  ]
}
```

### 4.2 页面职责

| 页面 | 路径 | 职责 |
|------|------|------|
| 首页 | `pages/home/index` | 展示学习概览、继续刷题和 4 门科目入口。 |
| 科目页 | `pages/subjects/index` | 展示 408 四科入口。 |
| 章节页 | `pages/chapters/index` | 按科目展示章节、题量和进度。 |
| 答题页 | `pages/practice/index` | 展示题目，处理单选、多选和综合题作答。 |
| 解析页 | `pages/result/index` | 展示判分结果、正确答案、解析和 AI 点评。 |
| 错题本 | `pages/wrong/index` | 展示错题列表，支持再次练习。 |
| 收藏夹 | `pages/favorites/index` | 展示收藏题目，支持取消收藏。 |
| 统计页 | `pages/stats/index` | 展示刷题数量、正确率和科目维度数据。 |
| 我的 | `pages/profile/index` | 展示用户信息和基础设置入口。 |

### 4.3 小程序端服务层

小程序端通过服务层封装云函数调用，页面不直接写 `wx.cloud.callFunction`。

```text
src/services
├─ cloud.ts
├─ auth.service.ts
├─ question.service.ts
├─ answer.service.ts
├─ favorite.service.ts
└─ stats.service.ts
```

服务层职责：

- 统一云函数调用格式。
- 统一处理加载、错误和响应结构。
- 为页面提供类型明确的方法。
- 避免页面直接耦合云函数名称和返回结构。

### 4.4 小程序端状态管理

首版状态管理保持简单：

- 用户信息：使用 Pinia 或轻量 store 保存。
- 当前练习状态：页面级状态即可。
- 收藏状态和错题状态：以云数据库为准，页面进入时重新拉取。

推荐 store：

```text
src/stores
├─ user.store.ts
└─ practice.store.ts
```

## 5. Web 管理后台设计

### 5.1 技术选择

管理后台使用 Vue 3 + TypeScript + Vite。UI 组件库首版建议使用 Element Plus，因为后台表单、表格和弹窗能力成熟，可以快速搭建录题流程。

### 5.2 页面结构

```text
src/pages
├─ login
│  └─ LoginPage.vue
├─ dashboard
│  └─ DashboardPage.vue
├─ questions
│  ├─ QuestionListPage.vue
│  ├─ QuestionEditorPage.vue
│  └─ QuestionPreviewDrawer.vue
├─ categories
│  └─ CategoryManagePage.vue
└─ settings
   └─ SettingsPage.vue
```

### 5.3 管理后台接口方式

首版推荐后台通过云函数 HTTP 访问或云开发 Web SDK 调用管理云函数。为了降低复杂度，技术实现优先采用统一的 `adminApi` 服务层封装。

```text
src/services
├─ admin-api.ts
├─ auth.service.ts
├─ question-admin.service.ts
└─ category-admin.service.ts
```

### 5.4 管理员认证

首版仅管理员本人使用，采用简单登录机制：

```text
管理员输入账号密码 → adminAuth 云函数校验 → 返回 adminToken → Web 后台本地保存 token → 后续请求携带 token
```

安全要求：

- `admin_users.passwordHash` 不保存明文密码。
- `adminToken` 设置过期时间。
- 管理后台接口必须校验 `adminToken`。
- 生产环境后台入口不公开宣传。

## 6. 云数据库设计

### 6.1 集合清单

| 集合 | 职责 |
|------|------|
| `users` | 保存微信用户基础信息。 |
| `categories` | 保存科目、章节和知识点树。 |
| `questions` | 保存题目主体、答案、解析和评分规则。 |
| `user_answers` | 保存用户每次答题记录。 |
| `wrong_questions` | 保存用户错题状态。 |
| `favorites` | 保存用户收藏关系。 |
| `ai_grading_records` | 保存 AI 判分记录和异常信息。 |
| `admin_users` | 保存管理员账号。 |

### 6.2 索引建议

| 集合 | 索引字段 | 用途 |
|------|----------|------|
| `users` | `openid` | 快速查找用户。 |
| `categories` | `type, parentId, sortOrder` | 查询科目、章节和知识点树。 |
| `questions` | `subjectId, chapterId, status` | 章节刷题查询。 |
| `questions` | `type, status` | 按题型筛选。 |
| `user_answers` | `openid, questionId, createdAt` | 用户答题记录查询。 |
| `wrong_questions` | `openid, status, updatedAt` | 错题本查询。 |
| `favorites` | `openid, questionId` | 收藏状态查询和去重。 |
| `ai_grading_records` | `openid, questionId, createdAt` | AI 判分记录追踪。 |
| `admin_users` | `username` | 管理员登录。 |

### 6.3 题目数据约束

- 单选题必须有 `options` 和 1 个标准答案。
- 多选题必须有 `options` 和至少 2 个标准答案。
- 综合题必须有 `referenceAnswer` 和 `gradingRubric`。
- 所有已发布题目必须有 `subjectId`、`chapterId`、`analysis` 和 `status`。
- 题目删除优先改为 `disabled` 状态，避免影响历史答题记录。

## 7. 云函数设计

### 7.1 统一响应结构

所有云函数返回统一结构：

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

### 7.2 云函数清单

| 云函数 | 入参 | 出参 | 职责 |
|--------|------|------|------|
| `login` | 微信上下文 | 用户信息 | 获取 OpenID，创建或更新用户。 |
| `getQuestionList` | 科目、章节、题型、分页 | 题目列表 | 查询已发布题目。 |
| `getQuestionDetail` | 题目 ID | 题目详情 | 获取题目详情和收藏状态。 |
| `submitAnswer` | 题目 ID、用户答案、耗时 | 判分结果 | 客观题判分，保存答题记录，更新错题。 |
| `gradeSubjectiveAnswer` | 题目 ID、文本答案、耗时 | AI 判分结果 | 综合题判分，保存记录，更新错题。 |
| `toggleFavorite` | 题目 ID、目标状态 | 收藏状态 | 收藏或取消收藏。 |
| `getWrongQuestions` | 科目、状态、分页 | 错题列表 | 查询用户错题。 |
| `getStudyStats` | 时间范围 | 统计数据 | 聚合用户学习数据。 |
| `adminAuth` | 用户名、密码 | Token | 管理员登录。 |
| `adminQuestionManage` | 动作、题目数据 | 操作结果 | 题目增删改查。 |
| `adminCategoryManage` | 动作、分类数据 | 操作结果 | 分类增删改查。 |

### 7.3 `submitAnswer` 处理流程

```text
接收题目 ID 和用户答案
  ↓
通过 OpenID 识别用户
  ↓
查询题目详情
  ↓
校验题目类型为单选或多选
  ↓
比较用户答案和标准答案
  ↓
写入 user_answers
  ↓
如果答错，写入或更新 wrong_questions
  ↓
返回判分结果和解析摘要
```

### 7.4 `gradeSubjectiveAnswer` 处理流程

```text
接收题目 ID 和用户文本答案
  ↓
通过 OpenID 识别用户
  ↓
查询题干、参考答案和评分规则
  ↓
调用 AI Grading Service
  ↓
解析统一判分结构
  ↓
写入 user_answers
  ↓
写入 ai_grading_records
  ↓
如果分数低于 60%，写入或更新 wrong_questions
  ↓
返回得分、点评、要点和解析
```

## 8. AI 判分服务设计

### 8.1 分层结构

```text
cloudfunctions/gradeSubjectiveAnswer
└─ ai-grading
   ├─ grading-service.ts
   ├─ prompt-builder.ts
   ├─ response-parser.ts
   └─ adapters
      ├─ base-adapter.ts
      └─ deepseek-adapter.ts
```

### 8.2 Prompt 输入

```text
你是考研 408 阅卷助手。请根据题干、参考答案和评分规则，对用户答案进行判分。

要求：
1. 只返回 JSON，不要返回 Markdown。
2. 分数必须在 0 到满分之间。
3. 点评应指出用户已命中的关键点和遗漏点。
4. 如果用户答案为空，得分为 0。
```

### 8.3 统一输出

```json
{
  "score": 8,
  "maxScore": 10,
  "hitPoints": ["说明了二叉排序树的中序遍历有序"],
  "missingPoints": ["没有分析最坏情况下的时间复杂度"],
  "comment": "答案覆盖了主要概念，但复杂度分析不完整。",
  "suggestion": "补充最坏情况下退化为链表时的复杂度分析。"
}
```

### 8.4 DeepSeek 适配器

DeepSeek 适配器职责：

- 从环境变量读取 `DEEPSEEK_API_KEY`。
- 构造兼容 DeepSeek API 的请求。
- 设置超时时间。
- 将模型返回转换为统一判分结构。
- 对解析失败、超时和限流返回标准错误码。

### 8.5 AI 判分风险控制

- 页面展示「AI 判分仅供学习参考」。
- 云函数保存原始响应，便于排查异常。
- 对用户答案长度设置上限，避免异常请求。
- 对同一用户短时间内的判分请求做频率限制。
- AI 失败时允许查看参考答案，不阻塞用户学习。

## 9. 共享类型设计

共享类型放在 `packages/shared`，供小程序端、后台和云函数复用。

### 9.1 核心枚举

```ts
export type QuestionType = 'single_choice' | 'multiple_choice' | 'subjective';

export type QuestionStatus = 'draft' | 'published' | 'disabled';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type WrongQuestionStatus = 'unresolved' | 'reviewing' | 'resolved';
```

### 9.2 核心模型

```ts
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
```

## 10. 错误处理设计

### 10.1 通用错误码

| 错误码 | 含义 |
|--------|------|
| `INVALID_PARAMS` | 请求参数不合法。 |
| `UNAUTHORIZED` | 未登录或管理员 Token 无效。 |
| `FORBIDDEN` | 无操作权限。 |
| `NOT_FOUND` | 数据不存在。 |
| `QUESTION_DISABLED` | 题目已下架。 |
| `AI_TIMEOUT` | AI 判分超时。 |
| `AI_PROVIDER_ERROR` | AI 服务异常。 |
| `AI_RESPONSE_PARSE_ERROR` | AI 响应解析失败。 |
| `INTERNAL_ERROR` | 未预期的服务端异常。 |

### 10.2 前端展示策略

- 参数错误：提示用户刷新或返回重试。
- 未登录：重新调用 `login`。
- 题目下架：提示「该题目暂不可用」。
- AI 判分失败：提示「AI 判分暂时不可用，请稍后重试」。
- 网络异常：提示「网络异常，请检查连接后重试」。

## 11. 测试策略

### 11.1 单元测试

优先覆盖纯逻辑模块：

- 客观题判分逻辑。
- 综合题 AI 响应解析逻辑。
- 参数校验逻辑。
- 错题状态更新逻辑。
- 共享类型辅助函数。

### 11.2 集成测试

重点验证云函数输入输出：

- `login` 创建用户。
- `getQuestionList` 返回已发布题目。
- `submitAnswer` 保存答题记录和错题。
- `gradeSubjectiveAnswer` 在模拟 AI 返回下保存判分记录。
- 管理后台新增题目后，小程序端可以查询。

### 11.3 端到端测试

通过 Playwright MCP 或浏览器自动化优先测试 Web 管理后台：

```text
打开后台 → 登录 → 新增题目 → 保存 → 题目列表出现 → 编辑题目 → 下架题目
```

小程序端最终使用微信开发者工具和真机调试验证。

## 12. 开发与发布流程

### 12.1 本地开发流程

```text
在 Windsurf 中编写源码
  ↓
运行小程序端和后台端类型检查/单元测试
  ↓
构建 uni-app 微信小程序产物
  ↓
使用微信开发者工具导入产物目录
  ↓
预览和真机调试
  ↓
上传体验版
  ↓
提交审核
```

### 12.2 环境变量

| 变量 | 所属 | 说明 |
|------|------|------|
| `WECHAT_CLOUD_ENV_ID` | 小程序/云函数 | 微信云开发环境 ID。 |
| `DEEPSEEK_API_KEY` | 云函数 | DeepSeek API Key。 |
| `ADMIN_TOKEN_SECRET` | 云函数 | 管理后台 Token 签名密钥。 |
| `ADMIN_TOKEN_EXPIRES_IN` | 云函数 | 管理后台 Token 过期时间。 |

### 12.3 发布注意事项

- 小程序隐私政策需要说明学习记录、昵称、头像和 OpenID 用途。
- AI 判分功能需要在页面标注「仅供参考」。
- 管理后台不作为微信小程序页面发布，单独部署。
- 云函数环境变量不得提交到代码仓库。

## 13. MVP 实施顺序

推荐按以下顺序实施：

1. 初始化仓库工程结构和共享类型。
2. 实现云函数基础能力和数据库种子数据。
3. 实现小程序端首页、科目、章节和客观题刷题闭环。
4. 实现错题、收藏和基础统计。
5. 实现综合题 AI 判分。
6. 实现 Web 管理后台题目录入。
7. 联调小程序、云函数和管理后台。
8. 使用微信开发者工具进行预览、真机调试和上线准备。

## 14. 未决策项

以下内容进入实现前需要由用户或实际环境确认：

- 微信云开发环境 ID。
- 小程序 AppID。
- DeepSeek 具体模型名称。
- 管理后台部署平台。
- 首批题目数量和来源。
- 是否使用 pnpm 作为包管理器。

## 15. 结论

本技术方案将系统拆分为小程序端、Web 管理后台、云函数、云数据库和共享类型 5 个边界清晰的部分。首版优先实现刷题闭环和管理后台录题能力，并通过模型适配层接入 DeepSeek 完成综合题 AI 判分。

该方案符合「在 Windsurf 中完成主要代码开发，最后可在微信小程序使用」的目标。
