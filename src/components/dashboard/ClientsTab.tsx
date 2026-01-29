import React from 'react';
import { Client, TabState } from '../../types/dashboard';
import { VirtualizedList } from '../common/VirtualizedList';

interface ClientsTabProps {
  state: TabState<Client>;
  onRetry: () => void;
}

const ClientRow: React.FC<{ client: Client }> = React.memo(({ client }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1.5fr',
        padding: '8px 12px',
        borderBottom: '1px solid #e5e7eb',
        fontSize: 14,
        alignItems: 'center',
      }}
    >
      <span>{client.name}</span>
      <span>{client.accountManager}</span>
      <span>{client.activeAssessments}</span>
      <span>{client.totalCandidates}</span>
      <span>{new Date(client.lastActiveAt).toLocaleDateString()}</span>
    </div>
  );
});

ClientRow.displayName = 'ClientRow';

export const ClientsTab: React.FC<ClientsTabProps> = React.memo(({ state, onRetry }) => {
  if (state.loading && !state.data) {
    return <div>Loading clients…</div>;
  }

  if (state.error && !state.data) {
    return (
      <div>
        <p style={{ color: '#b91c1c', marginBottom: 8 }}>Failed to load clients: {state.error}</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  const clients = state.data ?? [];

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1.5fr',
          padding: '8px 12px',
          borderBottom: '2px solid #e5e7eb',
          fontWeight: 600,
          fontSize: 13,
          backgroundColor: '#f9fafb',
        }}
      >
        <span>Client</span>
        <span>Account Manager</span>
        <span>Active Assessments</span>
        <span>Total Candidates</span>
        <span>Last Active</span>
      </div>

      {clients.length === 0 ? (
        <p style={{ padding: 12 }}>No clients found.</p>
      ) : (
        <VirtualizedList
          items={clients}
          itemHeight={40}
          height={480}
          overscan={8}
          renderItem={(item) => <ClientRow key={item.id} client={item} />}
        />
      )}
    </div>
  );
});

ClientsTab.displayName = 'ClientsTab';
