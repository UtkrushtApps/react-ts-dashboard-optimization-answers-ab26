import { Assessment, Candidate, Client } from '../types/dashboard';

// Simulated network latency in ms
const NETWORK_DELAY_MS = 600;

// Simulated API for fetching dashboard data. In a real app, these would call
// backend endpoints via fetch/axios and return typed responses.

function simulateNetwork<T>(data: T, delay: number = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

function generateCandidates(count: number): Candidate[] {
  const statuses: Candidate['status'][] = ['invited', 'in_progress', 'completed', 'rejected'];
  const result: Candidate[] = [];

  for (let i = 0; i < count; i += 1) {
    const status = statuses[i % statuses.length];
    const scoreBase = status === 'completed' ? 50 : status === 'in_progress' ? 30 : 10;

    result.push({
      id: `cand-${i + 1}`,
      name: `Candidate ${i + 1}`,
      email: `candidate${i + 1}@example.com`,
      score: Math.min(100, scoreBase + (i % 50)),
      status,
      appliedOn: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }

  return result;
}

function generateAssessments(count: number): Assessment[] {
  const statuses: Assessment['status'][] = ['draft', 'active', 'archived'];
  const result: Assessment[] = [];

  for (let i = 0; i < count; i += 1) {
    const status = statuses[i % statuses.length];

    result.push({
      id: `assess-${i + 1}`,
      title: `Full Stack Assessment ${i + 1}`,
      clientName: `Client ${1 + (i % 20)}`,
      averageScore: 40 + (i % 60),
      submissions: 50 + (i * 7) % 500,
      status,
      createdAt: new Date(Date.now() - i * 172800000).toISOString(),
    });
  }

  return result;
}

function generateClients(count: number): Client[] {
  const managers = ['Alice', 'Bob', 'Carol', 'David', 'Eve'];
  const result: Client[] = [];

  for (let i = 0; i < count; i += 1) {
    const activeAssessments = (i * 3) % 15;
    const totalCandidates = 100 + (i * 23) % 2000;

    result.push({
      id: `client-${i + 1}`,
      name: `Client ${i + 1}`,
      activeAssessments,
      totalCandidates,
      lastActiveAt: new Date(Date.now() - i * 259200000).toISOString(),
      accountManager: managers[i % managers.length],
    });
  }

  return result;
}

// Pre-generated datasets to avoid recomputing on every call.
const CANDIDATES_DATA = generateCandidates(1500);
const ASSESSMENTS_DATA = generateAssessments(300);
const CLIENTS_DATA = generateClients(200);

export async function fetchCandidates(): Promise<Candidate[]> {
  // In a real implementation, we would call the backend here.
  return simulateNetwork(CANDIDATES_DATA);
}

export async function fetchAssessments(): Promise<Assessment[]> {
  return simulateNetwork(ASSESSMENTS_DATA);
}

export async function fetchClients(): Promise<Client[]> {
  return simulateNetwork(CLIENTS_DATA);
}
