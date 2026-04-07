import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MdArrowBack, MdLocationOn, MdRefresh, MdInfo } from 'react-icons/md';
import { GiPlantSeed } from 'react-icons/gi';
import { Button, Card, Select, LoadingSpinner, ErrorState, NumericInput, LanguageSwitcher, InsightPanel, SmartReportButton } from '../components';
import { useGeolocation, useOnlineStatus } from '../hooks';
import { AgricultureAPI, CropFormData, CropRecommendationResponse } from '../api/agriculture';
import { cacheService } from '../services';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { generateAdvisory } from '../utils/advisoryEngine';
import { saveAnalysisHistory } from '../utils/analysisHistory';

const CropRecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useGeolocation();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<CropFormData>({
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    ph: 7,
    season: 'kharif',
    soil_type: 'Clay'
  });

  const [customCoordinates, setCustomCoordinates] = useState({
    lat: '',
    lon: '',
    useCustom: false
  });

  const [shouldFetch, setShouldFetch] = useState(false);



  const seasons = [
    { value: 'kharif', label: t('kharif') },
    { value: 'rabi', label: t('rabi') },
    { value: 'summer', label: t('summer') }
  ];

  const soilTypes = [
    { value: 'Clay', label: t('clay') },
    { value: 'Sandy', label: t('sandy') },
    { value: 'Loam', label: t('loam') },
    { value: 'Black', label: t('black') },
    { value: 'Red', label: t('red') }
  ];

  const getEffectiveLocation = () => {
    if (customCoordinates.useCustom && customCoordinates.lat && customCoordinates.lon) {
      return {
        lat: parseFloat(customCoordinates.lat),
        lon: parseFloat(customCoordinates.lon)
      };
    }
    return location;
  };

  // Auto-request location on mount - removed to prevent auto-fetching

  // Query for crop recommendation - only runs when explicitly triggered
  const {
    data: recommendations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['crop-recommendation', formData, getEffectiveLocation()],
    queryFn: async () => {
      const effectiveLocation = getEffectiveLocation();
      if (!effectiveLocation) throw new Error('Location is required');
      
      const cacheKey = cacheService.generateLocationKey(
        'crop-recommendation',
        effectiveLocation.lat,
        effectiveLocation.lon,
        formData
      );
      
      // Check cache first
      const cached = await cacheService.get<CropRecommendationResponse>(cacheKey);
      if (cached) return cached;
      
      // Make API call
      const result = await AgricultureAPI.recommendCrop(formData);
      
      // Cache result for 10 minutes
      await cacheService.set(cacheKey, result, 10 * 60 * 1000);
      
      return result;
    },
    enabled: shouldFetch && !!getEffectiveLocation() && isOnline,
    retry: 2,
  });

  const advisory = useMemo(() => generateAdvisory({
    cropName: recommendations?.[0]?.crop,
    ph: formData.ph,
    nitrogen: formData.nitrogen,
    phosphorus: formData.phosphorus,
    potassium: formData.potassium,
    temperature: 25,
    humidity: 65,
    rainfall: 100,
  }), [recommendations, formData]);

  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      saveAnalysisHistory({
        id: `crop-${Date.now()}`,
        type: 'crop',
        title: `Crop recommendation: ${recommendations[0].crop}`,
        summary: `Top recommendation based on ${formData.season} season and ${formData.soil_type} soil.`,
        value: `Confidence ${(recommendations[0].confidence * 100).toFixed(1)}%`,
        createdAt: new Date().toISOString(),
        metadata: { formData, recommendations },
      });
    }
  }, [recommendations]);

  const handleSubmit = () => {
    const effectiveLocation = getEffectiveLocation();
    if (!effectiveLocation) {
      toast.error('Location is required for weather data');
      return;
    }
    setShouldFetch(true);
    refetch();
  };

  const handleFormChange = (field: keyof CropFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setShouldFetch(false); // Reset fetch trigger when form changes
  };

  const toggleCustomCoordinates = () => {
    setCustomCoordinates(prev => ({ ...prev, useCustom: !prev.useCustom }));
    setShouldFetch(false);
  };

  const handleCoordinateChange = (field: 'lat' | 'lon', value: string) => {
    setCustomCoordinates(prev => ({ ...prev, [field]: value }));
    setShouldFetch(false);
  };

  if (!isOnline) {
    return (
      <div className="mobile-container max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            icon={<MdArrowBack />}
            size="sm"
          >
            {t('back')}
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('cropRecommendation')}
          </h1>
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </div>
        
        <ErrorState
          type="offline"
          message={t('cropRecommendationOfflineMessage')}
        />
      </div>
    );
  }

  return (
    <div className="mobile-container max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          icon={<MdArrowBack />}
          size="sm"
        >
          {t('back')}
        </Button>
        <GiPlantSeed className="text-xl sm:text-2xl text-primary-500 mr-2 sm:mr-3" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('cropRecommendation')}
        </h1>
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mobile-card-padding">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('soilParameters')}
            </h2>
            
            {/* Location Status */}
            <div className="mb-4 sm:mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                <div className="flex items-center">
                  <MdLocationOn className="text-primary-500 mr-2" />
                  <span className="text-xs sm:text-sm font-medium">
                    {customCoordinates.useCustom ? (
                      customCoordinates.lat && customCoordinates.lon ? 
                        `${t('customLocation')}: ${customCoordinates.lat}, ${customCoordinates.lon}` :
                        t('enterCustomCoordinates')
                    ) : locationLoading ? t('gettingLocation') :
                     location ? `${t('currentLocation')}: ${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}` :
                     t('locationRequired')}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={customCoordinates.useCustom ? 'primary' : 'secondary'}
                    onClick={toggleCustomCoordinates}
                  >
                    {customCoordinates.useCustom ? t('useGPS') : t('custom')}
                  </Button>
                  
                  {!customCoordinates.useCustom && !location && (
                    <Button
                      size="sm"
                      onClick={getCurrentLocation}
                      loading={locationLoading}
                      icon={<MdRefresh />}
                    >
                      {t('getLocation')}
                    </Button>
                  )}
                </div>
              </div>

              {customCoordinates.useCustom && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {t('latitude')}
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={customCoordinates.lat}
                      onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                      placeholder="e.g., 19.2096"
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {t('longitude')}
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={customCoordinates.lon}
                      onChange={(e) => handleCoordinateChange('lon', e.target.value)}
                      placeholder="e.g., 72.9633"
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              )}
              
              {locationError && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                  {locationError}
                </p>
              )}
            </div>

            {/* Soil Nutrients Notice */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start">
                <MdInfo className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">{t('noSoilData')}</p>
                  <p>
                    {t('visitSoilHealth')}{' '}
                    <a 
                      href="https://soilhealth.dac.gov.in/slusi-visualisation/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium underline hover:no-underline"
                    >
                      {t('soilHealthDashboard')}
                    </a>
                    {' '}{t('toFindMeanValues')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <NumericInput
                label={t('nitrogen') + ' (N)'}
                value={formData.nitrogen}
                onChange={(value) => handleFormChange('nitrogen', value)}
                min={0}
                max={300}
                unit="kg/ha"
                placeholder={t('enterNitrogenContent')}
              />
              
              <NumericInput
                label={t('phosphorus') + ' (P)'}
                value={formData.phosphorus}
                onChange={(value) => handleFormChange('phosphorus', value)}
                min={0}
                max={150}
                unit="kg/ha"
                placeholder={t('enterPhosphorusContent')}
              />
              
              <NumericInput
                label={t('potassium') + ' (K)'}
                value={formData.potassium}
                onChange={(value) => handleFormChange('potassium', value)}
                min={0}
                max={250}
                unit="kg/ha"
                placeholder={t('enterPotassiumContent')}
              />
              
              <NumericInput
                label={t('phLevel')}
                value={formData.ph}
                onChange={(value) => handleFormChange('ph', value)}
                min={3.5}
                max={9.5}
                step={0.1}
                placeholder={t('enterSoilPHLevel')}
              />
              
              <Select
                label={t('season')}
                value={formData.season}
                onChange={(e) => handleFormChange('season', e.target.value)}
                options={seasons}
              />
              
              <Select
                label={t('soilType')}
                value={formData.soil_type}
                onChange={(e) => handleFormChange('soil_type', e.target.value)}
                options={soilTypes}
              />
            </div>

            <Button
              fullWidth
              className="mt-6"
              onClick={handleSubmit}
              disabled={!getEffectiveLocation() || isLoading}
              loading={isLoading}
            >
              {t('getCropRecommendations')}
            </Button>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('recommendedCrops')}
            </h2>
            
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  {t('analyzingSoilConditions')}
                </span>
              </div>
            )}
            
            {error && (
              <ErrorState
                message={error.message || t('failedToGetRecommendations')}
                onRetry={refetch}
              />
            )}
            
            {recommendations && recommendations.length > 0 && (
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.crop}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {t(recommendation.crop.toLowerCase() as any) || recommendation.crop}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('rank')} #{index + 1}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {(recommendation.confidence * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t('confidence')}
                        </div>
                      </div>
                    </div>
                    
                    {/* Confidence bar */}
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${recommendation.confidence * 100}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {recommendations && recommendations.length > 0 && (
              <div className="mt-6 space-y-4">
                <InsightPanel advisory={advisory} />
                <SmartReportButton
                  filename="krishisarthi-crop-report"
                  title="KrishiSarthi Crop Advisory Report"
                  sections={[
                    { heading: 'Farm Input Summary', content: [
                      `Season: ${formData.season}`,
                      `Soil type: ${formData.soil_type}`,
                      `Nitrogen: ${formData.nitrogen} kg/ha`,
                      `Phosphorus: ${formData.phosphorus} kg/ha`,
                      `Potassium: ${formData.potassium} kg/ha`,
                      `pH: ${formData.ph}`
                    ]},
                    { heading: 'Top Recommendations', content: recommendations.map((recommendation, index) => `${index + 1}. ${recommendation.crop} - confidence ${(recommendation.confidence * 100).toFixed(1)}%`) },
                    { heading: 'Smart Advisory', content: advisory.insights }
                  ]}
                />
              </div>
            )}
            
            {!isLoading && !error && (!recommendations || recommendations.length === 0) && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <GiPlantSeed className="mx-auto text-4xl mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">{t('readyToRecommendTitle')}</p>
                <p className="text-sm">
                  {t('readyToRecommendDescription')}
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CropRecommendationPage;