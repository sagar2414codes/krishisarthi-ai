import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowBack, MdCameraAlt, MdUpload, MdClose, MdWifiOff, MdWifi, MdWarning, MdLocalHospital, MdInfo } from 'react-icons/md';
import { Button, Card, LoadingSpinner, ErrorState, LanguageSwitcher } from '../components';
import { useOnlineStatus } from '../hooks';
import { useLanguage } from '../contexts/LanguageContext';
import { tfliteService } from '../services';
import { DiseaseDetectionResponse } from '../api/agriculture';
import { toast } from 'react-hot-toast';
import { getTreatmentInfo, getSeverityColor } from '../data/diseaseTreatments';

const DiseaseDetectionPage: React.FC = () => {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(t('selectValidImage'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error(t('imageSizeLimit'));
      return;
    }

    setSelectedImage(file);
    setResult(null);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleCameraCapture = () => {
    // Create a file input that opens camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use rear camera
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageSelect(file);
      }
    };
    input.click();
  };

  const detectDisease = async () => {
    if (!selectedImage) {
      toast.error(t('selectImageFirst'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Use offline TFLite service
      const prediction = await tfliteService.detectDisease(selectedImage);
      setResult(prediction);
      toast.success(t('detectionCompleted'));
    } catch (err) {
      console.error('Disease detection failed:', err);
      setError(err instanceof Error ? err.message : 'Detection failed');
      toast.error(t('detectionFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="mobile-container max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 gap-3"
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
          <div className="text-xl sm:text-2xl mr-2 sm:mr-3">🔬</div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('diseaseDetection')}
          </h1>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <LanguageSwitcher />
          {isOnline ? (
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full flex items-center">
              <MdWifi className="mr-1" />
              {t('onlineMode')}
            </span>
          ) : (
            <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full flex items-center">
              <MdWifiOff className="mr-1" />
              {t('offlineMode')}
            </span>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Image Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mobile-card-padding">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('uploadPlantImage')}
            </h2>

            {!imagePreview ? (
              <div className="space-y-4">
                {/* Upload Options */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 sm:p-8 text-center">
                  <div className="text-3xl sm:text-4xl mb-4">📸</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                    {t('uploadPlantImage')}
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="primary"
                      icon={<MdCameraAlt />}
                      onClick={handleCameraCapture}
                      fullWidth
                    >
                      {t('takePhoto')}
                    </Button>
                    
                    <label className="cursor-pointer">
                      <div className="btn-secondary w-full touch-target flex items-center justify-center">
                        <MdUpload className="mr-2" />
                        {t('uploadImage')}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Tips */}
                <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2 text-sm sm:text-base">
                    📋 Tips for Better Results
                  </h3>
                  <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Use clear, well-lit images</li>
                    <li>• Focus on affected leaves or parts</li>
                    <li>• Avoid blurry or dark images</li>
                    <li>• Capture the diseased area clearly</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Selected plant"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-soft transition-colors"
                  >
                    <MdClose />
                  </button>
                </div>

                {/* Image Info */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div>File: {selectedImage?.name}</div>
                  <div>Size: {selectedImage ? (selectedImage.size / 1024 / 1024).toFixed(2) : 0} MB</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={detectDisease}
                    loading={isLoading}
                    disabled={!selectedImage}
                    className="flex-1"
                  >
                    {isLoading ? t('analyzingConditions') : t('detectDisease')}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={clearImage}
                    disabled={isLoading}
                  >
                    {t('clear')}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('detectionResults')}
            </h2>

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  Analyzing image...
                </span>
              </div>
            )}

            {error && (
              <ErrorState
                message={error}
                onRetry={detectDisease}
              />
            )}

            {result && (() => {
              const treatmentInfo = getTreatmentInfo(result.predicted_disease);
              
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Main Result */}
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-green-900 dark:text-green-200">
                        {t('detectionResult')}
                      </h3>
                      <span className="text-sm text-green-700 dark:text-green-300">
                        {(parseFloat(result.confidence) * 100).toFixed(1)}% {t('confidence')}
                      </span>
                    </div>
                    
                    <div className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">
                      {treatmentInfo?.name ? t(treatmentInfo.name as any) || treatmentInfo.name : result.predicted_disease}
                    </div>
                    
                    {/* Confidence Bar */}
                    <div className="w-full bg-green-200 dark:bg-green-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${parseFloat(result.confidence) * 100}%` }}
                      />
                    </div>
                  </div>

                  {treatmentInfo ? (
                    <div className="space-y-4">
                      {/* Disease Information */}
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                              {treatmentInfo.name}
                            </h4>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(treatmentInfo.severity)}`}>
                              <MdWarning className="mr-1" />
                              {treatmentInfo.severity}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                          <strong>{t('description')}:</strong> {treatmentInfo.description}
                        </p>
                        
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>{t('cause')}:</strong> {treatmentInfo.cause}
                        </div>
                      </div>

                      {/* Treatment Information */}
                      {treatmentInfo.treatment.length > 0 && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center mb-3">
                            <MdLocalHospital className="text-green-600 dark:text-green-400 mr-2" />
                            <h4 className="font-semibold text-green-900 dark:text-green-200">
                              {t('treatmentOptions')}
                            </h4>
                          </div>
                          
                          <ul className="space-y-2">
                            {treatmentInfo.treatment.map((treatment, index) => (
                              <li key={index} className="flex items-start text-sm text-green-800 dark:text-green-200">
                                <span className="mr-2 text-green-600 dark:text-green-400">•</span>
                                <span>{treatment}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Prevention Information */}
                      {treatmentInfo.prevention.length > 0 && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <div className="flex items-center mb-3">
                            <MdInfo className="text-amber-600 dark:text-amber-400 mr-2" />
                            <h4 className="font-semibold text-amber-900 dark:text-amber-200">
                              {t('preventionMeasures')}
                            </h4>
                          </div>
                          
                          <ul className="space-y-2">
                            {treatmentInfo.prevention.map((prevention, index) => (
                              <li key={index} className="flex items-start text-sm text-amber-800 dark:text-amber-200">
                                <span className="mr-2 text-amber-600 dark:text-amber-400">•</span>
                                <span>{prevention}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Professional Advice Notice */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex items-start">
                          <MdInfo className="text-gray-600 dark:text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            <p className="font-medium mb-1">⚠️ {t('importantNotice')}</p>
                            <p>
                              {t('professionalAdvice')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Fallback for diseases without treatment info */
                    <div className="space-y-4">
                      {/* Health Status */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Plant Health Status
                        </h4>
                        <div className="text-sm">
                          {result.predicted_disease.toLowerCase().includes('healthy') ? (
                            <span className="text-green-600 dark:text-green-400">
                              ✅ Plant appears healthy
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400">
                              ⚠️ Disease detected - Consider treatment
                            </span>
                          )}
                        </div>
                      </div>

                      {/* General Recommendation */}
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <h4 className="font-medium text-amber-900 dark:text-amber-200 mb-1">
                          💡 {t('recommendation')}
                        </h4>
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          {result.predicted_disease.toLowerCase().includes('healthy') 
                            ? t('plantHealthy')
                            : t('diseaseDetected')
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })()}            {!isLoading && !error && !result && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">🔍</div>
                <p>Upload an image to detect plant diseases using AI</p>
                <p className="text-sm mt-2">Works completely offline!</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Offline Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
      >
        <div className="flex items-center">
          <div className="text-green-600 dark:text-green-400 mr-3">🌐</div>
          <div>
            <h3 className="font-medium text-green-900 dark:text-green-200">
              {t('offlineDetection')}
            </h3>
            <p className="text-sm text-green-800 dark:text-green-300 mt-1">
              {t('offlineDescription')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DiseaseDetectionPage;