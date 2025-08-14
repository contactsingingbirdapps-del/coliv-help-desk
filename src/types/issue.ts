export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type IssueCategory = 
  | 'maintenance'
  | 'cleaning'
  | 'noise'
  | 'utilities'
  | 'safety'
  | 'other';

export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export type IssueStatus = 'open' | 'in-progress' | 'resolved';

export interface IssueFormData {
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
}