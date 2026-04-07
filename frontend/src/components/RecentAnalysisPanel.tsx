import React, { useMemo, useState } from 'react';
import { Card } from './Card';
import { clearAnalysisHistory, getAnalysisHistory } from '../utils/analysisHistory';
import { MdHistory, MdDeleteOutline } from 'react-icons/md';

const RecentAnalysisPanel: React.FC = () => {
  const [refreshToken, setRefreshToken] = useState(0);
  const items = useMemo(() => getAnalysisHistory(), [refreshToken]);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <MdHistory className="text-primary-500 text-xl" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Analysis History</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Saved locally to make your demo feel like a real farmer workflow.</p>
          </div>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => { clearAnalysisHistory(); setRefreshToken(v => v + 1); }}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <MdDeleteOutline /> Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-4 text-sm text-gray-500 dark:text-gray-400">
          No saved analysis yet. Run crop or profit predictions to populate your KrishiSarthi dashboard.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 bg-white/70 dark:bg-gray-800/60">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-wide text-primary-600 dark:text-primary-300 font-semibold">{item.type}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.summary}</p>
              {item.value && <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mt-2">{item.value}</div>}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentAnalysisPanel;
