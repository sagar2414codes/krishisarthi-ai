import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { GiWheat } from 'react-icons/gi';
import { Select } from './Form';
import { LoadingSpinner } from './Loading';
import { AgricultureAPI, CropData } from '../api/agriculture';

interface CropSelectorProps {
  value: string;
  onChange: (cropValue: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showCostAndYield?: boolean;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  value,
  onChange,
  label,
  error,
  helperText,
  className = '',
  placeholder,
  required = false,
  disabled = false,
  showCostAndYield = true
}) => {

  const {
    data: cropsResponse,
    isLoading,
    isError,
    error: fetchError
  } = useQuery({
    queryKey: ['crops'],
    queryFn: () => AgricultureAPI.getAvailableCrops(),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 2
  });

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-scale">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <div className="input-field flex items-center justify-center min-h-touch">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              Loading crops...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-scale">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <div className="input-field border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center text-red-600 dark:text-red-400">
              <GiWheat className="mr-2" />
              <span className="text-sm">
                Failed to load crops. Please try again.
              </span>
            </div>
          </div>
        </div>
        {fetchError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {fetchError instanceof Error ? fetchError.message : 'Unknown error'}
          </p>
        )}
      </div>
    );
  }

  const crops = cropsResponse?.crops || [];
  
  // Create options for the select component
  const options = [
    ...(placeholder ? [{ value: '', label: placeholder }] : []),
    ...crops.map((crop: CropData) => ({
      value: crop.value,
      label: crop.label
    }))
  ];

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-scale">
          <div className="flex items-center">
            <GiWheat className="mr-2 text-primary-500" />
            {label} {required && <span className="text-red-500">*</span>}
          </div>
        </label>
      )}
      
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
        error={error}
        disabled={disabled || isLoading}
        className="min-h-touch"
        style={{ minHeight: '44px' }}
      />
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
      
      {value && crops.length > 0 && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {(() => {
            const selectedCrop = crops.find((crop: CropData) => crop.value === value);
            if (!selectedCrop) return null;
            
            return (
              <div className="text-sm">
                <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {selectedCrop.label}
                </div>
                {showCostAndYield && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Est. Cost:</span>{' '}
                      ₹{(selectedCrop.estimated_cost_per_hectare || 0).toLocaleString()}/ha
                    </div>
                    <div>
                      <span className="font-medium">Yield Range:</span>{' '}
                      {(() => {
                        const yieldRange = selectedCrop.yield_tons_per_hectare_range || [0, 0];
                        return `${yieldRange[0]}-${yieldRange[1]} t/ha`;
                      })()}
                    </div>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCrop.sustainability && (
                    <>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedCrop.sustainability.water_usage_rating <= 3 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : selectedCrop.sustainability.water_usage_rating <= 7
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        Water Usage: {10 - selectedCrop.sustainability.water_usage_rating}/10
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedCrop.sustainability.pesticide_rating <= 3
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : selectedCrop.sustainability.pesticide_rating <= 7
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        Low Pesticides: {10 - selectedCrop.sustainability.pesticide_rating}/10
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default CropSelector;