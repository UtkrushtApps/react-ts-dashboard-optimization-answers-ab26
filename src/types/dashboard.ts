export type DashboardTab = 'candidates' | 'assessments' | 'clients';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  score: number;
  status: 'invited' | 'in_progress' | 'completed' | 'rejected';
  appliedOn: string; // ISO string
}

export interface Assessment {
  id: string;
  title: string;
  clientName: string;
  averageScore: number;
  submissions: number;
  status: 'draft' | 'active' | 'archived';
  createdAt: string; // ISO string
}

export interface Client {
  id: string;
  name: string;
  activeAssessments: number;
  totalCandidates: number;
  lastActiveAt: string; // ISO string
  accountManager: string;
}

export interface TabState<T> {
  data: T[] | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}
