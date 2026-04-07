import React from 'react';
import { motion } from 'framer-motion';
import { MdAutoAwesome, MdTrendingUp } from 'react-icons/md';
import { Card } from './Card';
import { AdvisoryOutput } from '../utils/advisoryEngine';

interface InsightPanelProps {
  title?: string;
  advisory: AdvisoryOutput;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ title = 'Smart Advisory Engine', advisory }) => {
  return (
    <Card className="p-5 sm:p-6 border-primary-200/60 dark:border-primary-700/40">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MdAutoAwesome className="text-primary-500 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Decision-support insights generated from the latest farm inputs.</p>
        </div>
        <div className="rounded-2xl bg-primary-50 dark:bg-primary-900/20 px-4 py-3 text-center min-w-[100px]">
          <div className="text-2xl font-bold text-primary-700 dark:text-primary-300">{advisory.score}</div>
          <div className="text-xs uppercase tracking-wide text-primary-700/80 dark:text-primary-300/80">Farm score</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-4">
        <MdTrendingUp />
        <span>{advisory.status}</span>
      </div>

      <div className="space-y-3">
        {advisory.insights.map((insight, index) => (
          <motion.div
            key={`${insight}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/90 dark:bg-gray-800/70 p-3 text-sm text-gray-700 dark:text-gray-200"
          >
            {insight}
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default InsightPanel;
