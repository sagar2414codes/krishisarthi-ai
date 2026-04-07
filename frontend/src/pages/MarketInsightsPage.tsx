import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdTrendingUp, MdShoppingCart, MdLocationOn, MdRefresh } from 'react-icons/md';
import { FaRupeeSign } from 'react-icons/fa';
import { Button, Card, CropSelector } from '../components';
import { useLanguage } from '../contexts/LanguageContext';
import { AgricultureAPI } from '../api/agriculture';
import { MandiPriceData, MandiPriceResult } from '../api/types';

const MarketInsightsPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<MandiPriceData>({
    state: '',
    district: '',
    crop: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MandiPriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const states = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana', 'Himachal Pradesh',
    'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
    'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  const handleInputChange = (field: keyof MandiPriceData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.state || !formData.district || !formData.crop) {
      setError(t('fillAllFields'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await AgricultureAPI.getMandiPrices(formData);
      setResult(response);
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Handle different error cases
        if (err.message.includes('404') || err.message.includes('not found')) {
          setError(`No price data found for ${formData.crop} in ${formData.district}, ${formData.state}. Try a different location or crop.`);
        } else if (err.message.includes('503')) {
          setError('Service temporarily unavailable. Please try again later.');
        } else {
          setError(err.message);
        }
      } else {
        setError(t('genericError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl mr-4">
            <MdTrendingUp className="text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('marketInsights')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {t('marketInsightsDesc')}
        </p>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* State Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('state')}
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="input-field"
                >
                  <option value="">{t('selectState')}</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('district')}
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder={t('enterDistrict')}
                  className="input-field"
                />
              </div>

              {/* Crop Selection */}
              <div className="md:col-span-2">
                <CropSelector
                  label={t('crop')}
                  value={formData.crop}
                  onChange={(value) => handleInputChange('crop', value)}
                  placeholder={t('selectCrop')}
                  helperText="Select a crop to view current market prices and trends"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t('fetchingPrices')}</span>
                </>
              ) : (
                <>
                  <MdShoppingCart />
                  <span>{t('getMarketPrices')}</span>
                </>
              )}
            </Button>
          </form>
        </Card>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center">
              <div className="text-red-500 mr-3 text-xl">⚠️</div>
              <div>
                <h4 className="text-red-800 dark:text-red-200 font-medium">Error</h4>
                <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Results Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    {t('priceInformation')}
                  </h2>
                  <div className="flex items-center text-orange-100">
                    <MdLocationOn className="mr-2" />
                    <span className="text-sm sm:text-base">
                      {result.district}, {result.state}
                    </span>
                  </div>
                </div>
                <div className="text-4xl opacity-20">
                  <MdTrendingUp />
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Crop Info */}
                <div className="text-center">
                  <div className="text-3xl mb-2">🌾</div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {t('commodity')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {result.price_data.commodity}
                  </p>
                </div>

                {/* Modal Price */}
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-500 text-2xl mb-2">
                    <FaRupeeSign />
                    <span className="ml-1 font-bold">
                      {formatPrice(result.price_data.modal_price)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Modal Price
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('perQuintal')}
                  </p>
                </div>

                {/* Min Price */}
                <div className="text-center">
                  <div className="flex items-center justify-center text-green-500 text-2xl mb-2">
                    <FaRupeeSign />
                    <span className="ml-1 font-bold">
                      {formatPrice(result.price_data.min_price)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {t('minimumPrice')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('perQuintal')}
                  </p>
                </div>

                {/* Max Price */}
                <div className="text-center">
                  <div className="flex items-center justify-center text-red-500 text-2xl mb-2">
                    <FaRupeeSign />
                    <span className="ml-1 font-bold">
                      {formatPrice(result.price_data.max_price)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {t('maximumPrice')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('perQuintal')}
                  </p>
                </div>
              </div>

              {/* Market Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Market Location
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {result.district}, {result.state}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleSubmit}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <MdRefresh />
                    <span>{t('refresh')}</span>
                  </Button>
                </div>
              </div>

              {/* Price Range Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    {t('priceRange')}
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-300">
                    ₹{formatPrice(result.price_data.max_price - result.price_data.min_price)} {t('difference')}
                  </span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-blue-600 dark:text-blue-300">
                  <span>{t('minimum')}</span>
                  <span>{t('maximum')}</span>
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Price Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-green-600 dark:text-green-300 font-medium">Average:</span>
                    <span className="ml-2 text-green-800 dark:text-green-100 font-bold">
                      ₹{formatPrice(result.price_data.modal_price)}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-600 dark:text-green-300 font-medium">Range:</span>
                    <span className="ml-2 text-green-800 dark:text-green-100 font-bold">
                      ₹{formatPrice(result.price_data.min_price)} - ₹{formatPrice(result.price_data.max_price)}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-600 dark:text-green-300 font-medium">Crop:</span>
                    <span className="ml-2 text-green-800 dark:text-green-100 font-bold capitalize">
                      {result.crop}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-start">
            <div className="p-2 bg-green-500 text-white rounded-lg mr-3">
              <MdTrendingUp />
            </div>
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                {t('realTimeData')}
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                {t('realTimeDataDesc')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-start">
            <div className="p-2 bg-orange-500 text-white rounded-lg mr-3">
              <MdShoppingCart />
            </div>
            <div>
              <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">
                {t('betterDecisions')}
              </h4>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                {t('betterDecisionsDesc')}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default MarketInsightsPage;