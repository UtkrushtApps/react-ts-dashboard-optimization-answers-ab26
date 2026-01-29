# Solution Steps

1. Create a shared type definition file (e.g., src/types/dashboard.ts) and define all domain types: DashboardTab as a union of 'candidates' | 'assessments' | 'clients', and strong interfaces for Candidate, Assessment, Client, plus a generic TabState<T> that tracks data, loading, error, and lastFetched per tab.

2. Implement a mock API layer (src/api/dashboardApi.ts) that simulates backend calls: create generator functions to build large arrays of Candidate, Assessment, and Client objects, store them in module-level constants, and expose async functions fetchCandidates, fetchAssessments, fetchClients that return these arrays after a simulated network delay via a helper simulateNetwork<T>().

3. Design a centralized dashboard data hook (src/hooks/useDashboardData.ts) using useReducer to keep state for all three tabs in a single DashboardState object, with a TabState<T> for each tab, and a reducer that handles REQUEST, SUCCESS, and FAILURE actions per tab without affecting other tabs.

4. Inside useDashboardData, implement fetchForTab(tab, { force? }) using useCallback: based on the tab, select the correct API function, dispatch REQUEST, call the API, then dispatch SUCCESS or FAILURE with the result and a timestamp; before firing, if not forcing and the tab already has non-error, non-loading data, early-return to avoid redundant refetches.

5. In useDashboardData, add a useEffect that runs when activeTab or state changes: check the active tab’s TabState and, if it has no data and isn’t currently loading or in error, lazily call fetchForTab(activeTab) so that each tab fetches only on first activation rather than on every tab switch.

6. Expose from useDashboardData an API of { state, refreshTab, isAnyLoading }: state is the full DashboardState, refreshTab(tab) calls fetchForTab(tab, { force: true }) to explicitly refetch only that tab, and isAnyLoading is derived via useMemo by OR-ing the loading flags of all three tabs for use in global UI controls.

7. Build the tab header UI as a small, memoized component (src/components/common/Tabs.tsx) that takes the list of tab definitions, activeTab, and onChange, and renders buttons with active styling; wrap it in React.memo so tab labels don’t re-render unnecessarily when unrelated props change.

8. Implement a lightweight, dependency-free virtualized list component (src/components/common/VirtualizedList.tsx): accept items, fixed itemHeight, container height, overscan, and renderItem; track scrollTop in local state, compute startIndex/endIndex and offsetY with useMemo based on scrollTop, itemHeight, and height, slice items to visibleItems, and render them in a scrollable div with a tall spacer and an absolutely positioned inner wrapper to only mount rows within the window (+ overscan).

9. Create optimized tab content components for each dataset: CandidatesTab.tsx, AssessmentsTab.tsx, ClientsTab.tsx. Each takes a TabState<T> and onRetry, shows loading/error states when no cached data exists, and otherwise renders a header row plus a VirtualizedList of data; define a row component per tab (CandidateRow, AssessmentRow, ClientRow) and wrap each in React.memo so that individual rows only re-render when their own data changes.

10. Implement the main Dashboard component (src/components/dashboard/Dashboard.tsx): keep activeTab in local state, call useDashboardData(activeTab) to get shared data and refreshTab, render Tabs with a stable onChange handler (useCallback), show a global Refresh button wired to refreshTab(activeTab) and disabled while any tab is loading, compute a per-tab “last updated” label from state[activeTab].lastFetched via useMemo, and conditionally render the three tab components based on activeTab so only the active tab’s large list is mounted at a time.

11. Wire everything through the app entry points: in src/App.tsx render the Dashboard component; in src/index.tsx create a React 18 root and render <App /> inside <React.StrictMode>; optionally add a minimal src/index.css to reset margins and set basic fonts. This final structure ensures each tab’s data is lazily fetched once, reused across tab switches, and rendered via a virtualized list to minimize DOM nodes and re-renders for large datasets.

