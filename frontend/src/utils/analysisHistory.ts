export interface AnalysisHistoryItem {
  id: string;
  type: 'crop' | 'profit' | 'yield' | 'disease' | 'advisory';
  title: string;
  summary: string;
  value?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = 'krishisarthi-analysis-history';

export function getAnalysisHistory(): AnalysisHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAnalysisHistory(item: AnalysisHistoryItem) {
  if (typeof window === 'undefined') return;
  const items = getAnalysisHistory();
  const updated = [item, ...items].slice(0, 12);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearAnalysisHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
