import React from 'react';
import { Candidate, TabState } from '../../types/dashboard';
import { VirtualizedList } from '../common/VirtualizedList';

interface CandidatesTabProps {
  state: TabState<Candidate>;
  onRetry: () => void;
}

const CandidateRow: React.FC<{ candidate: Candidate }> = React.memo(({ candidate }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr',
        padding: '8px 12px',
        borderBottom: '1px solid #e5e7eb',
        fontSize: 14,
        alignItems: 'center',
      }}
    >
      <span>{candidate.name}</span>
      <span>{candidate.email}</span>
      <span>{candidate.score}</span>
      <span style={{ textTransform: 'capitalize' }}>{candidate.status.replace('_', ' ')}</span>
      <span>{new Date(candidate.appliedOn).toLocaleDateString()}</span>
    </div>
  );
});

CandidateRow.displayName = 'CandidateRow';

export const CandidatesTab: React.FC<CandidatesTabProps> = React.memo(({ state, onRetry }) => {
  if (state.loading && !state.data) {
    return <div>Loading candidates…</div>;
  }

  if (state.error && !state.data) {
    return (
      <div>
        <p style={{ color: '#b91c1c', marginBottom: 8 }}>Failed to load candidates: {state.error}</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  const candidates = state.data ?? [];

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr',
          padding: '8px 12px',
          borderBottom: '2px solid #e5e7eb',
          fontWeight: 600,
          fontSize: 13,
          backgroundColor: '#f9fafb',
        }}
      >
        <span>Name</span>
        <span>Email</span>
        <span>Score</span>
        <span>Status</span>
        <span>Applied On</span>
      </div>

      {candidates.length === 0 ? (
        <p style={{ padding: 12 }}>No candidates found.</p>
      ) : (
        <VirtualizedList
          items={candidates}
          itemHeight={40}
          height={480}
          overscan={8}
          renderItem={(item) => <CandidateRow key={item.id} candidate={item} />}
        />
      )}
    </div>
  );
});

CandidatesTab.displayName = 'CandidatesTab';
