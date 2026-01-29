import React, { useCallback, useMemo, useState } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { DashboardTab } from '../../types/dashboard';
import { Tabs } from '../common/Tabs';
import { CandidatesTab } from './CandidatesTab';
import { AssessmentsTab } from './AssessmentsTab';
import { ClientsTab } from './ClientsTab';

const TABS = [
  { id: 'candidates' as DashboardTab, label: 'Candidates' },
  { id: 'assessments' as DashboardTab, label: 'Assessments' },
  { id: 'clients' as DashboardTab, label: 'Clients' },
];

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('candidates');

  const { state, refreshTab, isAnyLoading } = useDashboardData(activeTab);

  const handleTabChange = useCallback((tab: DashboardTab) => {
    setActiveTab(tab);
  }, []);

  const handleRefresh = useCallback(() => {
    refreshTab(activeTab);
  }, [activeTab, refreshTab]);

  const lastUpdatedText = useMemo(() => {
    const tabState = state[activeTab];
    if (!tabState.lastFetched) {
      return 'Never';
    }
    return new Date(tabState.lastFetched).toLocaleTimeString();
  }, [activeTab, state]);

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 24,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: '#111827',
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Assessment Analytics</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Monitor candidates, assessments, and client activity in one place.</p>
      </header>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>Last updated: {lastUpdatedText}</span>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isAnyLoading}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              backgroundColor: isAnyLoading ? '#f9fafb' : '#ffffff',
              cursor: isAnyLoading ? 'default' : 'pointer',
              fontSize: 13,
            }}
          >
            {isAnyLoading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      <main>
        {activeTab === 'candidates' && (
          <CandidatesTab state={state.candidates} onRetry={() => refreshTab('candidates')} />
        )}
        {activeTab === 'assessments' && (
          <AssessmentsTab state={state.assessments} onRetry={() => refreshTab('assessments')} />
        )}
        {activeTab === 'clients' && <ClientsTab state={state.clients} onRetry={() => refreshTab('clients')} />}
      </main>
    </div>
  );
};
