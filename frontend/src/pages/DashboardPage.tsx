import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowBack, MdInsights, MdWaterDrop, MdAttachMoney, MdWbSunny, MdShieldMoon } from 'react-icons/md';
import { Button, Card } from '../components';
import InsightPanel from '../components/InsightPanel';
import RecentAnalysisPanel from '../components/RecentAnalysisPanel';
import { generateAdvisory } from '../utils/advisoryEngine';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const advisory = generateAdvisory({
    cropName: 'Rice / Wheat planning mix',
    temperature: 31,
    humidity: 71,
    rainfall: 92,
    ph: 6.8,
    nitrogen: 58,
    yieldTons: 4.3,
    netProfit: 64000,
  });

  const metrics = [
    { label: 'Farm readiness', value: `${advisory.score}/100`, icon: <MdInsights />, accent: 'from-emerald-500 to-green-600' },
    { label: 'Water planning', value: 'Balanced', icon: <MdWaterDrop />, accent: 'from-sky-500 to-cyan-600' },
    { label: 'Profit projection', value: '₹64k/ha', icon: <MdAttachMoney />, accent: 'from-amber-500 to-orange-600' },
    { label: 'Weather risk', value: 'Moderate', icon: <MdWbSunny />, accent: 'from-violet-500 to-fuchsia-600' },
  ];

  return (
    <div className="mobile-container max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} icon={<MdArrowBack />} size="sm">Back</Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">KrishiSarthi Command Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Unified crop planning, financial outlook and advisory intelligence.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, idx) => (
          <Card key={metric.label} className="p-5 overflow-hidden">
            <div className={`inline-flex rounded-2xl bg-gradient-to-br ${metric.accent} p-3 text-white text-2xl mb-4`}>{metric.icon}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{metric.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <InsightPanel advisory={advisory} title="Integrated farm advisory" />
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <MdShieldMoon className="text-primary-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">What makes this version original</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">Smart advisory engine combines weather, soil, yield and profit into actionable recommendations.</div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">Persistent analysis history makes the app feel like a real farm decision platform.</div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">Dashboard-first experience changes the identity from a simple tool collection to a product suite.</div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4">Downloadable smart reports help with demos, viva explanation and GitHub presentation.</div>
            </div>
          </Card>
        </div>
        <div>
          <RecentAnalysisPanel />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
