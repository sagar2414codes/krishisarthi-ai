import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdAttachMoney, MdEco, MdTrendingUp, MdLocationOn, MdRefresh, MdInfo } from 'react-icons/md';
import { GiWheat } from 'react-icons/gi';
import { FaRupeeSign } from 'react-icons/fa';
import { Card } from './Card';
import InsightPanel from './InsightPanel';
import SmartReportButton from './SmartReportButton';
import { Button } from './Button';
import { Select } from './Form';
import NumericInput from './NumericInput';
import { AgricultureAPI, ProfitCalculatorData, ProfitCalculatorResult } from '../api/agriculture';
import { useGeolocation } from '../hooks';
import { LoadingSpinner } from './Loading';
import { ErrorState } from './Error';
import { useLanguage } from '../contexts/LanguageContext';
import { generateAdvisory } from '../utils/advisoryEngine';
import { saveAnalysisHistory } from '../utils/analysisHistory';

interface ProfitCalculatorCardProps {
}

export const ProfitCalculatorCard: React.FC<ProfitCalculatorCardProps> = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ProfitCalculatorData>({
    nitrogen: 40,
    phosphorus: 30,
    potassium: 35,
    ph: 6.5,
    season: 'Kharif',
    crop: 'rice',
    state: 'Maharashtra',
    district: ''
  });

  const [customCoordinates, setCustomCoordinates] = useState({
    lat: '',
    lon: '',
    useCustom: false
  });

  const [result, setResult] = useState<ProfitCalculatorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCrops, setAvailableCrops] = useState<Array<{value: string, label: string}>>([]);
  const [cropsLoading, setCropsLoading] = useState(false);

  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useGeolocation();

  const indianStates = [
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Manipur', label: 'Manipur' },
    { value: 'Meghalaya', label: 'Meghalaya' },
    { value: 'Mizoram', label: 'Mizoram' },
    { value: 'Nagaland', label: 'Nagaland' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Sikkim', label: 'Sikkim' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Tripura', label: 'Tripura' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Uttarakhand', label: 'Uttarakhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    // Union Territories
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
    { value: 'Ladakh', label: 'Ladakh' },
    { value: 'Puducherry', label: 'Puducherry' },
    { value: 'Chandigarh', label: 'Chandigarh' },
    { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
    { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'Lakshadweep', label: 'Lakshadweep' }
  ];

  const seasons = [
    { value: 'Kharif', label: 'Kharif (Monsoon Season)' },
    { value: 'Rabi', label: 'Rabi (Winter Season)' },
    { value: 'Summer', label: 'Summer/Zaid Season' }
  ];

  // Fetch available crops from API
  useEffect(() => {
    const fetchCrops = async () => {
      setCropsLoading(true);
      try {
        const response = await AgricultureAPI.getAvailableCrops();
        const cropOptions = response.crops.map(crop => ({
          value: crop.value,
          label: crop.label
        }));
        setAvailableCrops(cropOptions);
        
        // If current crop is not in the list, set to first available crop
        const currentCrop = formData.crop;
        if (cropOptions.length > 0 && !cropOptions.find(c => c.value === currentCrop)) {
          setFormData(prev => ({
            ...prev,
            crop: cropOptions[0].value
          }));
        }
      } catch (err) {
        console.error('Failed to fetch crops:', err);
        // Keep the default crops if API fails
        const fallbackCrops = [
          { value: 'rice', label: 'Rice' },
          { value: 'wheat', label: 'Wheat' },
          { value: 'maize', label: 'Maize' },
          { value: 'cotton', label: 'Cotton' },
          { value: 'sugarcane', label: 'Sugarcane' },
          { value: 'groundnut', label: 'Groundnut' },
          { value: 'soybean', label: 'Soybean' },
          { value: 'tomato', label: 'Tomato' }
        ];
        setAvailableCrops(fallbackCrops);
        
        const currentCrop = formData.crop;
        if (!fallbackCrops.find(c => c.value === currentCrop)) {
          setFormData(prev => ({
            ...prev,
            crop: 'rice'
          }));
        }
      } finally {
        setCropsLoading(false);
      }
    };

    fetchCrops();
  }, []); // Remove formData from dependencies to avoid infinite loops

  const getEffectiveLocation = () => {
    if (customCoordinates.useCustom && customCoordinates.lat && customCoordinates.lon) {
      return {
        lat: parseFloat(customCoordinates.lat),
        lon: parseFloat(customCoordinates.lon)
      };
    }
    return location;
  };

  const toggleCustomCoordinates = () => {
    setCustomCoordinates(prev => ({
      ...prev,
      useCustom: !prev.useCustom
    }));
  };

  const handleCoordinateChange = (field: 'lat' | 'lon', value: string) => {
    setCustomCoordinates(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormChange = (field: keyof ProfitCalculatorData, value: string | number) => {
    setFormData((prev: ProfitCalculatorData) => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value)
    }));
  };

  const handleSubmit = async () => {
    const effectiveLocation = getEffectiveLocation();
    if (!effectiveLocation) {
      setError('Location is required for weather data. Please enable location access or enter coordinates.');
      return;
    }

    if (!formData.district.trim()) {
      setError('District is required for market price data.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await AgricultureAPI.calculateProfitSustainability(formData);
      setResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate profit and sustainability metrics');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };


  const advisory = generateAdvisory({
    cropName: result?.crop || formData.crop,
    ph: formData.ph,
    nitrogen: formData.nitrogen,
    phosphorus: formData.phosphorus,
    potassium: formData.potassium,
    yieldTons: result?.predicted_yield_tons_per_hectare,
    netProfit: result?.estimated_net_profit_per_hectare,
  });

  useEffect(() => {
    if (result) {
      saveAnalysisHistory({
        id: `profit-${Date.now()}`,
        type: 'profit',
        title: `Profit analysis: ${result.crop}`,
        summary: `Estimated profitability for ${formData.crop} in ${formData.district}, ${formData.state}.`,
        value: `${formatCurrency(result.estimated_net_profit_per_hectare)} net profit per hectare`,
        createdAt: new Date().toISOString(),
        metadata: { formData, result },
      });
    }
  }, [result]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mobile-card-padding">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('soilCropParameters')}
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

          {/* Info Notice */}
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start">
              <MdInfo className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800 dark:text-green-200">
                <p className="font-medium mb-1">{t('profitSustainabilityAnalysis')}</p>
                <p>
                  {t('profitCalculatorDescription')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <NumericInput
              label={t('nitrogen')}
              value={formData.nitrogen}
              onChange={(value: number) => handleFormChange('nitrogen', value)}
              min={0}
              max={300}
              unit="kg/ha"
              placeholder={t('enterNitrogenContent')}
            />
            
            <NumericInput
              label={t('phosphorus')}
              value={formData.phosphorus}
              onChange={(value: number) => handleFormChange('phosphorus', value)}
              min={0}
              max={150}
              unit="kg/ha"
              placeholder={t('enterPhosphorusContent')}
            />
            
            <NumericInput
              label={t('potassium')}
              value={formData.potassium}
              onChange={(value: number) => handleFormChange('potassium', value)}
              min={0}
              max={250}
              unit="kg/ha"
              placeholder={t('enterPotassiumContent')}
            />
            
            <NumericInput
              label={t('soilPH')}
              value={formData.ph}
              onChange={(value: number) => handleFormChange('ph', value)}
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('crop')} {cropsLoading && <span className="text-xs text-gray-500">({t('loading')}...)</span>}
              </label>
              <select
                value={formData.crop}
                onChange={(e) => handleFormChange('crop', e.target.value)}
                disabled={cropsLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:text-white disabled:opacity-50"
              >
                {cropsLoading ? (
                  <option value="">{t('loadingCrops')}</option>
                ) : availableCrops.length > 0 ? (
                  availableCrops.map((crop) => (
                    <option key={crop.value} value={crop.value}>
                      {crop.label}
                    </option>
                  ))
                ) : (
                  <option value="">{t('noCropsAvailable')}</option>
                )}
              </select>
            </div>

            <Select
              label={t('state')}
              value={formData.state}
              onChange={(e) => handleFormChange('state', e.target.value)}
              options={indianStates}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('district')}
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleFormChange('district', e.target.value)}
                placeholder={t('districtPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <Button
            fullWidth
            className="mt-6"
            onClick={handleSubmit}
            disabled={!getEffectiveLocation() || loading || !formData.district.trim()}
            loading={loading}
          >
            {t('calculateProfitSustainability')}
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
            {t('analysisResults')}
          </h2>
          
          {loading && (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                {t('analyzingProfitPotential')}
              </span>
            </div>
          )}
          
          {error && (
            <ErrorState
              message={error}
              onRetry={() => setError(null)}
            />
          )}
          
          {result && !loading && (
            <div className="space-y-6">
              {result.message ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <MdLocationOn className="text-lg" />
                    <p className="text-sm">{result.message}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <GiWheat className="text-xl text-green-600 dark:text-green-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('predictedYield')}</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {result.predicted_yield_tons_per_hectare} {t('tonsPerHectare')}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <FaRupeeSign className="text-xl text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('marketPrice')}</h3>
                      </div>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                        ₹{result.avg_market_price_per_quintal}/{t('quintal')}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {t('source')}: {result.priceDataSource}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <MdEco className="text-xl text-purple-600 dark:text-purple-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('sustainability')}</h3>
                      </div>
                      <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                        {result.sustainability_score_out_of_10}/10
                      </p>
                      <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-700"
                          style={{ width: `${(result.sustainability_score_out_of_10 / 10) * 100}%` }}
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Financial Breakdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <MdTrendingUp className="text-green-600 dark:text-green-400" />
                      {t('financialAnalysisPerHectare')}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('totalRevenue')}</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(result.estimated_total_revenue_per_hectare)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('inputCosts')}</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          {formatCurrency(result.estimated_input_cost_per_hectare)}
                        </span>
                      </div>
                      <hr className="border-gray-200 dark:border-gray-600" />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{t('netProfit')}</span>
                        <span className={`font-bold ${
                          result.estimated_net_profit_per_hectare >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(result.estimated_net_profit_per_hectare)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {!result.message && (
                <div className="space-y-4">
                  <InsightPanel advisory={advisory} title="Profit-linked advisory" />
                  <SmartReportButton
                    filename="krishisarthi-profit-report"
                    title="KrishiSarthi Profit & Sustainability Report"
                    sections={[
                      { heading: 'Farm Context', content: [
                        `Crop: ${formData.crop}`,
                        `Season: ${formData.season}`,
                        `Location: ${formData.district}, ${formData.state}`,
                        `Nitrogen: ${formData.nitrogen} kg/ha`,
                        `Phosphorus: ${formData.phosphorus} kg/ha`,
                        `Potassium: ${formData.potassium} kg/ha`,
                        `pH: ${formData.ph}`
                      ]},
                      { heading: 'Financial Summary', content: [
                        `Predicted yield: ${result.predicted_yield_tons_per_hectare} tons/hectare`,
                        `Average market price: ₹${result.avg_market_price_per_quintal} per quintal`,
                        `Revenue: ${formatCurrency(result.estimated_total_revenue_per_hectare)}`,
                        `Input cost: ${formatCurrency(result.estimated_input_cost_per_hectare)}`,
                        `Net profit: ${formatCurrency(result.estimated_net_profit_per_hectare)}`,
                        `Sustainability score: ${result.sustainability_score_out_of_10}/10`
                      ]},
                      { heading: 'Advisory Insights', content: advisory.insights }
                    ]}
                  />
                </div>
              )}
            </div>
          )}
          
          {!loading && !error && !result && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <MdAttachMoney className="mx-auto text-4xl mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">{t('readyToCalculate')}</p>
              <p className="text-sm">
                {t('readyToCalculateDesc')}
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};