import React from 'react';
import { Assessment, TabState } from '../../types/dashboard';
import { VirtualizedList } from '../common/VirtualizedList';

interface AssessmentsTabProps {
  state: TabState<Assessment>;
  onRetry: () => void;
}

const AssessmentRow: React.FC<{ assessment: Assessment }> = React.memo(({ assessment }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
        padding: '8px 12px',
        borderBottom: '1px solid #e5e7eb',
        fontSize: 14,
        alignItems: 'center',
      }}
    >
      <span>{assessment.title}</span>
      <span>{assessment.clientName}</span>
      <span>{assessment.averageScore.toFixed(1)}</span>
      <span>{assessment.submissions}</span>
      <span style={{ textTransform: 'capitalize' }}>{assessment.status}</span>
      <span>{new Date(assessment.createdAt).toLocaleDateString()}</span>
    </div>
  );
});

AssessmentRow.displayName = 'AssessmentRow';

export const AssessmentsTab: React.FC<AssessmentsTabProps> = React.memo(({ state, onRetry }) => {
  if (state.loading && !state.data) {
    return <div>Loading assessments…</div>;
  }

  if (state.error && !state.data) {
    return (
      <div>
        <p style={{ color: '#b91c1c', marginBottom: 8 }}>Failed to load assessments: {state.error}</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  const assessments = state.data ?? [];

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
          padding: '8px 12px',
          borderBottom: '2px solid #e5e7eb',
          fontWeight: 600,
          fontSize: 13,
          backgroundColor: '#f9fafb',
        }}
      >
        <span>Title</span>
        <span>Client</span>
        <span>Avg. Score</span>
        <span>Submissions</span>
        <span>Status</span>
        <span>Created At</span>
      </div>

      {assessments.length === 0 ? (
        <p style={{ padding: 12 }}>No assessments found.</p>
      ) : (
        <VirtualizedList
          items={assessments}
          itemHeight={40}
          height={480}
          overscan={8}
          renderItem={(item) => <AssessmentRow key={item.id} assessment={item} />}
        />
      )}
    </div>
  );
});

AssessmentsTab.displayName = 'AssessmentsTab';
