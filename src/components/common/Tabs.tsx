import React from 'react';
import { DashboardTab } from '../../types/dashboard';

export interface TabDefinition {
  id: DashboardTab;
  label: string;
}

interface TabsProps {
  tabs: TabDefinition[];
  activeTab: DashboardTab;
  onChange: (tab: DashboardTab) => void;
}

export const Tabs: React.FC<TabsProps> = React.memo(({ tabs, activeTab, onChange }) => {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 16 }}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: isActive ? '#111827' : '#6b7280',
              fontWeight: isActive ? 600 : 500,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
});

Tabs.displayName = 'Tabs';
