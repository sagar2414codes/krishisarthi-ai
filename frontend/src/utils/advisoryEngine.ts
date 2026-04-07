export interface AdvisoryInput {
  temperature?: number;
  humidity?: number;
  rainfall?: number;
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  yieldTons?: number;
  netProfit?: number;
  cropName?: string;
}

export interface AdvisoryOutput {
  score: number;
  status: string;
  insights: string[];
}

export function generateAdvisory(input: AdvisoryInput): AdvisoryOutput {
  const insights: string[] = [];
  let score = 72;

  if (input.temperature !== undefined) {
    if (input.temperature > 34) {
      insights.push('High temperature detected. Prefer early morning irrigation and mulch to reduce moisture loss.');
      score -= 6;
    } else if (input.temperature < 18) {
      insights.push('Cool weather may slow growth. Monitor germination and nutrient uptake carefully.');
      score -= 3;
    } else {
      insights.push('Temperature is within a stable range for most field operations.');
      score += 4;
    }
  }

  if (input.humidity !== undefined) {
    if (input.humidity >= 80) {
      insights.push('High humidity can increase fungal disease pressure. Improve airflow and monitor leaf spots.');
      score -= 5;
    } else if (input.humidity >= 55) {
      insights.push('Humidity is moderate and generally suitable for steady crop development.');
      score += 3;
    }
  }

  if (input.rainfall !== undefined) {
    if (input.rainfall > 140) {
      insights.push('Rainfall outlook is strong. Avoid over-irrigation and check field drainage.');
      score -= 4;
    } else if (input.rainfall < 40) {
      insights.push('Rainfall appears low. Plan irrigation scheduling and conserve water.');
      score -= 4;
    } else {
      insights.push('Rainfall level looks balanced for regular crop activity.');
      score += 4;
    }
  }

  if (input.ph !== undefined) {
    if (input.ph < 5.8 || input.ph > 7.8) {
      insights.push('Soil pH is outside the ideal range for many crops. Consider corrective soil management.');
      score -= 5;
    } else {
      insights.push('Soil pH is in a workable range for nutrient availability.');
      score += 4;
    }
  }

  if (input.nitrogen !== undefined && input.nitrogen < 40) {
    insights.push('Nitrogen appears low. A balanced nutrient plan may improve vegetative growth.');
    score -= 3;
  }

  if (input.yieldTons !== undefined) {
    if (input.yieldTons >= 4) {
      insights.push('Yield outlook is strong. Maintain consistency in irrigation and pest scouting.');
      score += 6;
    } else if (input.yieldTons < 2.5) {
      insights.push('Yield outlook is modest. Review seed quality, spacing, and nutrient timing.');
      score -= 5;
    }
  }

  if (input.netProfit !== undefined) {
    if (input.netProfit > 50000) {
      insights.push('Profitability estimate is attractive. Consider saving this plan as a benchmark scenario.');
      score += 5;
    } else if (input.netProfit < 20000) {
      insights.push('Profit margin looks thin. Compare alternative crops or reduce avoidable input costs.');
      score -= 6;
    }
  }

  if (input.cropName) {
    insights.unshift(`Primary crop focus: ${input.cropName}. Use localized practices for best results.`);
  }

  score = Math.max(35, Math.min(96, score));
  const status = score >= 85 ? 'Excellent outlook' : score >= 72 ? 'Promising outlook' : score >= 60 ? 'Needs optimization' : 'High attention required';

  return { score, status, insights: insights.slice(0, 6) };
}
