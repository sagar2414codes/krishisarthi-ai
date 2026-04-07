import apiClient from './apiClient';
import {
  CropRecommendationResponse,
  YieldPredictionResponse,
  DiseaseDetectionResponse,
  MandiPriceResponse,
  ProfitCalculatorResponse,
  EnrichedSoilData,
  YieldPredictionData,
  ProfitCalculatorData,
  MandiPriceData,
  CropsResponse,
} from './types';

export class AgricultureAPI {
  // Crop Recommendation
  static async recommendCrop(
    data: EnrichedSoilData
  ): Promise<CropRecommendationResponse> {
    const response = await apiClient.post('/api/recommend/crop', {
      ...data,
      temperature: 25, // Default value as backend expects this
      humidity: 65,    // Default value as backend expects this
      rainfall: 100,   // Default value as backend expects this
    });
    return response.data.recommendations;
  }

  // Yield Prediction
  static async predictYield(
    data: YieldPredictionData
  ): Promise<YieldPredictionResponse> {
    const response = await apiClient.post('/predict-yield', data);
    return response.data;
  }

  // Disease Detection
  static async detectDisease(imageFile: File): Promise<DiseaseDetectionResponse> {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await apiClient.post('/api/predict/disease', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      predicted_disease: response.data.prediction,
      confidence: response.data.confidence.toFixed(4),
    };
  }

  // Mandi Prices
  static async getMandiPrices(data: MandiPriceData): Promise<MandiPriceResponse> {
    const response = await apiClient.get('/api/prices', {
      params: {
        state: data.state,
        district: data.district,
        crop: data.crop,
      },
    });
    return response.data;
  }

  // Get Available Crops
  static async getAvailableCrops(): Promise<CropsResponse> {
    const response = await apiClient.get('/api/crops');
    return response.data;
  }

  // Profit & Sustainability Calculator
  static async calculateProfitSustainability(
    data: ProfitCalculatorData
  ): Promise<ProfitCalculatorResponse> {
    const response = await apiClient.post('/calculate-profit-sustainability', data);
    return response.data;
  }

  // Health check
  static async healthCheck(): Promise<{ status: string }> {
    try {
      await apiClient.get('/docs');
      return { status: 'ok' };
    } catch (error) {
      throw error;
    }
  }
}

// Re-export types for convenience
export * from './types';