import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from './store';
import { setOnlineStatus, setTheme } from './store/appSlice';
import { useOnlineStatus, useTheme } from './hooks';
import { NetworkStatus, LoadingPage } from './components';
import { Suspense } from 'react';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const CropRecommendationPage = React.lazy(() => import('./pages/CropRecommendationPage'));
const YieldPredictionPage = React.lazy(() => import('./pages/YieldPredictionPage'));
const DiseaseDetectionPage = React.lazy(() => import('./pages/DiseaseDetectionPage'));
const MarketInsightsPage = React.lazy(() => import('./pages/MarketInsightsPage'));
const ProfitCalculatorPage = React.lazy(() => import('./pages/ProfitCalculatorPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));

function App() {
  const dispatch = useAppDispatch();
  const isOnline = useOnlineStatus();
  const { theme } = useTheme();

  // Sync online status with Redux store
  useEffect(() => {
    dispatch(setOnlineStatus(isOnline));
  }, [isOnline, dispatch]);

  // Sync theme with Redux store
  useEffect(() => {
    dispatch(setTheme(theme));
  }, [theme, dispatch]);

  return (
    <div className="min-h-screen-safe bg-gray-50 dark:bg-gray-900 transition-colors duration-300 safe-area-full">
      <NetworkStatus isOnline={isOnline} />
      
      <main className="mobile-container py-4 min-h-screen-safe">
        <Suspense fallback={<LoadingPage message="Loading page..." />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
            <Route path="/yield-prediction" element={<YieldPredictionPage />} />
            <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
            <Route path="/market-insights" element={<MarketInsightsPage />} />
            <Route path="/profit-calculator" element={<ProfitCalculatorPage />} />
            <Route path="/smart-dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;