export interface Location {
  lat: number;
  lon: number;
}

export interface CropData {
  value: string;
  label: string;
  api_names: string[];
  estimated_cost_per_hectare: number;
  yield_tons_per_hectare_range: [number, number];
  sustainability: {
    water_usage_rating: number;
    pesticide_rating: number;
    soil_health_impact: number;
  };
}

export interface CropsResponse {
  crops: CropData[];
}

export interface EnrichedSoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  season: string;
  soil_type: string;
}

export interface CropRecommendation {
  crop: string;
  confidence: number;
}

export interface YieldPredictionData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  season: string;
  crop: string;
}

export interface YieldPredictionResult {
  predicted_crop: string;
  estimated_yield_tons_per_hectare: number;
  weather_data_used: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
}

export interface DiseaseDetectionResult {
  predicted_disease: string;
  confidence: string;
}

export interface MandiPriceData {
  state: string;
  district: string;
  crop: string;
}

export interface PriceData {
  commodity: string;
  modal_price: number;
  min_price: number;
  max_price: number;
}

export interface MandiPriceResult {
  state: string;
  district: string;
  crop: string;
  price_data: PriceData;
}

export interface ProfitCalculatorData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  season: string;
  crop: string;
  state: string;
  district: string;
}

export interface ProfitCalculatorResult {
  crop: string;
  predicted_yield_tons_per_hectare: number;
  avg_market_price_per_quintal: number;
  estimated_total_revenue_per_hectare: number;
  estimated_input_cost_per_hectare: number;
  estimated_net_profit_per_hectare: number;
  sustainability_score_out_of_10: number;
  priceDataSource: string;
  message?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

// Form data interfaces
export interface CropFormData extends EnrichedSoilData {}

export interface YieldFormData extends YieldPredictionData {}

export interface ProfitCalculatorFormData extends ProfitCalculatorData {}

// API Response types
export type CropRecommendationResponse = CropRecommendation[];
export type YieldPredictionResponse = YieldPredictionResult;
export type DiseaseDetectionResponse = DiseaseDetectionResult;
export type MandiPriceResponse = MandiPriceResult;
export type ProfitCalculatorResponse = ProfitCalculatorResult;

// Error types
export interface ApiError {
  message: string;
  status?: number;
}