import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MdArrowBack, MdLocationOn, MdRefresh, MdInfo } from 'react-icons/md';
import { GiWheat } from 'react-icons/gi';
import { Button, Card, CropSelector, Select, LoadingSpinner, ErrorState, NumericInput, LanguageSwitcher } from '../components';
import { useGeolocation, useOnlineStatus } from '../hooks';
import { useLanguage } from '../contexts/LanguageContext';
import { AgricultureAPI, YieldFormData, YieldPredictionResponse } from '../api/agriculture';
import { cacheService } from '../services';
import { toast } from 'react-hot-toast';

const YieldPredictionPage: React.FC = () => {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useGeolocation();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<YieldFormData>({
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    ph: 7,
    season: 'kharif',
    crop: 'rice'
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

  // Query for yield prediction - only runs when explicitly triggered
  const {
    data: prediction,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['yield-prediction', formData, getEffectiveLocation()],
    queryFn: async () => {
      const effectiveLocation = getEffectiveLocation();
      if (!effectiveLocation) throw new Error('Location is required');
      
      const cacheKey = cacheService.generateLocationKey(
        'yield-prediction',
        effectiveLocation.lat,
        effectiveLocation.lon,
        formData
      );
      
      // Check cache first
      const cached = await cacheService.get<YieldPredictionResponse>(cacheKey);
      if (cached) return cached;
      
      // Make API call
      const result = await AgricultureAPI.predictYield(formData);
      
      // Cache result for 10 minutes
      await cacheService.set(cacheKey, result, 10 * 60 * 1000);
      
      return result;
    },
    enabled: shouldFetch && !!getEffectiveLocation() && isOnline,
    retry: 2,
  });

  const handleSubmit = () => {
    const effectiveLocation = getEffectiveLocation();
    if (!effectiveLocation) {
      toast.error('Location is required for weather data');
      return;
    }
    setShouldFetch(true);
    refetch();
  };

  const handleFormChange = (field: keyof YieldFormData, value: string | number) => {
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
            {t('yieldPrediction')}
          </h1>
        </div>
        
        <ErrorState
          type="offline"
          message={t('yieldPredictionOfflineMessage')}
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
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            icon={<MdArrowBack />}
            size="sm"
          >
            {t('back')}
          </Button>
          <GiWheat className="text-xl sm:text-2xl text-primary-500 mr-2 sm:mr-3" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('yieldPrediction')}
          </h1>
        </div>
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
              {t('yieldParameters')}
            </h2>
            
            {/* Location Status */}
            <div className="mb-4 sm:mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                <div className="flex items-center">
                  <MdLocationOn className="text-primary-500 mr-2" />
                  <span className="text-sm font-medium">
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
              <CropSelector
                label={t('crop')}
                value={formData.crop}
                onChange={(value) => handleFormChange('crop', value)}
                placeholder={t('selectCrop')}
                helperText="Choose the crop you want to predict yield for. Additional crop information will be displayed below."
                showCostAndYield={false}
              />
              
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
            </div>

            <Button
              fullWidth
              className="mt-6"
              onClick={handleSubmit}
              disabled={!getEffectiveLocation() || isLoading}
              loading={isLoading}
            >
              {t('predictYield')}
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
              {t('yieldPredictionResults')}
            </h2>
            
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  {t('analyzingConditions')}
                </span>
              </div>
            )}
            
            {error && (
              <ErrorState
                message={error.message || t('failedToPredictYield')}
                onRetry={refetch}
              />
            )}
            
            {prediction && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Main Result */}
                <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg border border-primary-200 dark:border-primary-800">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {prediction.estimated_yield_tons_per_hectare} tons/ha
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {t('estimatedYieldFor')} {prediction.predicted_crop ? (t(prediction.predicted_crop.toLowerCase() as any) || prediction.predicted_crop) : 'your crop'}
                  </div>
                </div>

                {/* Weather Data Used */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {t('weatherDataUsed')}
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {prediction.weather_data_used.temperature.toFixed(1)}°C
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t('temperature')}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {prediction.weather_data_used.humidity.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t('humidity')}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {prediction.weather_data_used.rainfall.toFixed(0)}mm
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t('rainfall')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Yield Categories */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {t('yieldCategory')}
                  </h4>
                  <div className="text-sm">
                    {prediction.estimated_yield_tons_per_hectare >= 4 && (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        High Yield - Excellent conditions
                      </span>
                    )}
                    {prediction.estimated_yield_tons_per_hectare >= 2.5 && prediction.estimated_yield_tons_per_hectare < 4 && (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        Moderate Yield - Good conditions
                      </span>
                    )}
                    {prediction.estimated_yield_tons_per_hectare < 2.5 && (
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        Low Yield - Consider optimization
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {!isLoading && !error && !prediction && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <GiWheat className="mx-auto text-4xl mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Ready to Predict</p>
                <p className="text-sm">
                  Select your crop, enter soil parameters, and click "Predict Yield" to get yield estimates for your location.
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default YieldPredictionPage;