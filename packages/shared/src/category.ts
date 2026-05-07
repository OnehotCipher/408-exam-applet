export type CategoryType = 'subject' | 'chapter' | 'knowledge_point';

export interface Category {
  _id: string;
  type: CategoryType;
  name: string;
  parentId: string | null;
  sortOrder: number;
  enabled: boolean;
}
