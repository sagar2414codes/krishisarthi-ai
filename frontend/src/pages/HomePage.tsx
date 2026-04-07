import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdAgriculture, MdAutoAwesome, MdDarkMode, MdLightMode, MdTimeline, MdAttachMoney, MdDashboard, MdScience } from 'react-icons/md';
import { GiPlantSeed, GiWheat } from 'react-icons/gi';
import { FeatureCard, LanguageSwitcher, AgriculturalNews, Card, RecentAnalysisPanel } from '../components';
import { useAppSelector } from '../store';
import { useTheme } from '../hooks';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isOnline = useAppSelector(state => state.app.isOnline);
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      title: 'Smart Crop Planning',
      description: 'AI crop recommendations using soil profile, season and weather-aware inputs.',
      icon: <GiPlantSeed />,
      path: '/crop-recommendation',
      requiresInternet: true,
      badge: 'AI Planner'
    },
    {
      title: 'Yield Intelligence',
      description: 'Forecast expected production and convert predictions into practical farm strategy.',
      icon: <GiWheat />,
      path: '/yield-prediction',
      requiresInternet: true,
      badge: 'Forecast'
    },
    {
      title: 'Disease Vision',
      description: 'Offline-ready leaf disease detection with fast image-based diagnosis.',
      icon: <MdScience />,
      path: '/disease-detection',
      requiresInternet: false,
      badge: 'Offline Ready'
    },
    {
      title: 'Market & Profit Desk',
      description: 'Track mandi prices and estimate revenue, cost and sustainability outcomes.',
      icon: <MdAttachMoney />,
      path: '/profit-calculator',
      requiresInternet: true,
      badge: 'Business Layer'
    },
    {
      title: 'Command Dashboard',
      description: 'A new executive view that combines advisory, analytics and recent farm decisions.',
      icon: <MdDashboard />,
      path: '/smart-dashboard',
      requiresInternet: false,
      badge: 'New'
    }
  ];

  const highlights = [
    { label: 'Advisory score engine', value: 'New layer' },
    { label: 'Saved farm history', value: '12 runs' },
    { label: 'Decision support focus', value: 'High-level' },
  ];

  return (
    <div className="min-h-screen-safe">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="pt-4 pb-8">
        <div className="flex items-center justify-between mb-8 gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-3 text-white shadow-card">
              <MdAgriculture className="text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">KrishiSarthi</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">AI-powered smart farming companion</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="touch-target p-2 rounded-lg bg-white dark:bg-gray-800 shadow-soft hover:shadow-card transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-primary-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="xl:col-span-2">
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50 via-white to-lime-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 border-primary-100 dark:border-primary-900/40 h-full">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300 mb-4">
                <MdAutoAwesome /> upgraded product identity
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
                From crop prediction to
                <span className="text-gradient block">full farm decision support</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed mb-6">
                KrishiSarthi transforms the original agriculture app into a smarter platform with advisory logic,
                analysis history, premium dashboarding and downloadable smart reports.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('/smart-dashboard')} className="btn-primary inline-flex items-center gap-2">
                  <MdDashboard /> Open Command Dashboard
                </button>
                <button onClick={() => navigate('/crop-recommendation')} className="btn-secondary inline-flex items-center gap-2">
                  <GiPlantSeed /> Start Crop Analysis
                </button>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <RecentAnalysisPanel />
          </motion.div>
        </div>
      </motion.header>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {highlights.map((item, index) => (
          <Card key={item.label} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3 text-primary-600 dark:text-primary-300">
                {index === 0 ? <MdAutoAwesome className="text-xl" /> : index === 1 ? <MdTimeline className="text-xl" /> : <MdDashboard className="text-xl" />}
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.value}</div>
              </div>
            </div>
          </Card>
        ))}
      </motion.section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Platform modules</h3>
            <p className="text-gray-600 dark:text-gray-400">A stronger structure that makes your version look original on GitHub and in viva.</p>
          </div>
        </div>
        <div className="mobile-feature-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.08 }}
              className="h-full"
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                onClick={() => navigate(feature.path)}
                disabled={feature.requiresInternet && !isOnline}
                badge={feature.badge}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">What is new in KrishiSarthi</h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">Dashboard-first interface for integrated crop, yield and profit decision-making.</div>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">Smart advisory engine that converts model outputs into readable farm actions.</div>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">Recent analysis history and downloadable smart reports for better product feel.</div>
          </div>
        </Card>

        <AgriculturalNews />
      </section>
    </div>
  );
};

export default HomePage;
