import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { fetchAssessments, fetchCandidates, fetchClients } from '../api/dashboardApi';
import { Assessment, Candidate, Client, DashboardTab, TabState } from '../types/dashboard';

interface DashboardState {
  candidates: TabState<Candidate>;
  assessments: TabState<Assessment>;
  clients: TabState<Client>;
}

type TabKey = keyof DashboardState;

interface RequestAction {
  type: 'REQUEST';
  tab: TabKey;
}

interface SuccessAction<TTab extends TabKey> {
  type: 'SUCCESS';
  tab: TTab;
  data: DashboardState[TTab]['data'];
  timestamp: number;
}

interface FailureAction {
  type: 'FAILURE';
  tab: TabKey;
  error: string;
  timestamp: number;
}

type DashboardAction = RequestAction | SuccessAction<TabKey> | FailureAction;

const createInitialTabState = <T,>(): TabState<T> => ({
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
});

const initialState: DashboardState = {
  candidates: createInitialTabState<Candidate>(),
  assessments: createInitialTabState<Assessment>(),
  clients: createInitialTabState<Client>(),
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'REQUEST': {
      const tabState = state[action.tab];
      return {
        ...state,
        [action.tab]: {
          ...tabState,
          loading: true,
          error: null,
        },
      };
    }
    case 'SUCCESS': {
      const tabState = state[action.tab];
      return {
        ...state,
        [action.tab]: {
          ...tabState,
          loading: false,
          error: null,
          data: action.data ?? null,
          lastFetched: action.timestamp,
        },
      };
    }
    case 'FAILURE': {
      const tabState = state[action.tab];
      return {
        ...state,
        [action.tab]: {
          ...tabState,
          loading: false,
          error: action.error,
          lastFetched: action.timestamp,
        },
      };
    }
    default:
      return state;
  }
}

interface UseDashboardDataResult {
  state: DashboardState;
  refreshTab: (tab: DashboardTab) => void;
  isAnyLoading: boolean;
}

/**
 * Centralized data-fetching hook for the dashboard.
 *
 * Optimizations:
 * - Each tab's data is fetched lazily on first access instead of all at once.
 * - Data is cached per tab and reused when switching between tabs.
 * - Refreshing only refetches the active tab, not the entire dashboard.
 * - State is stored in a single reducer to keep updates scoped and predictable.
 */
export function useDashboardData(activeTab: DashboardTab): UseDashboardDataResult {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const fetchForTab = useCallback(
    async (tab: DashboardTab, options?: { force?: boolean }) => {
      const { force = false } = options ?? {};

      // Avoid redundant requests when we already have data and not forcing.
      if (!force) {
        const tabState = state[tab];
        if (tabState.data && !tabState.error && !tabState.loading) {
          return;
        }
      }

      let fetchPromise: Promise<unknown>;

      switch (tab) {
        case 'candidates':
          fetchPromise = fetchCandidates();
          break;
        case 'assessments':
          fetchPromise = fetchAssessments();
          break;
        case 'clients':
          fetchPromise = fetchClients();
          break;
        default:
          return;
      }

      dispatch({ type: 'REQUEST', tab });
      const startedAt = Date.now();

      try {
        const data = await fetchPromise;
        dispatch({ type: 'SUCCESS', tab, data: data as any, timestamp: startedAt });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        dispatch({ type: 'FAILURE', tab, error: message, timestamp: startedAt });
      }
    },
    [state]
  );

  // Lazily fetch data only for the active tab when needed.
  useEffect(() => {
    const tabState = state[activeTab];

    if (!tabState.data && !tabState.loading && !tabState.error) {
      void fetchForTab(activeTab);
    }
  }, [activeTab, fetchForTab, state]);

  const refreshTab = useCallback(
    (tab: DashboardTab) => {
      void fetchForTab(tab, { force: true });
    },
    [fetchForTab]
  );

  const isAnyLoading = useMemo(
    () => state.candidates.loading || state.assessments.loading || state.clients.loading,
    [state]
  );

  return {
    state,
    refreshTab,
    isAnyLoading,
  };
}
