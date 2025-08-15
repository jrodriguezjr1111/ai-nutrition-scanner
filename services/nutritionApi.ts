import { Product, NutrientInfo } from '@/stores/types';

// OpenFoodFacts API types
interface OpenFoodFactsProduct {
  code: string;
  product: {
    product_name?: string;
    brands?: string;
    serving_size?: string;
    nutriments?: {
      'energy-kcal_100g'?: number;
      'fat_100g'?: number;
      'saturated-fat_100g'?: number;
      'sodium_100g'?: number;
      'carbohydrates_100g'?: number;
      'fiber_100g'?: number;
      'sugars_100g'?: number;
      'proteins_100g'?: number;
    };
    image_url?: string;
    nutriscore_grade?: string;
  };
  status: number;
  status_verbose: string;
}

const OPENFOODFACTS_API_BASE = 'https://world.openfoodfacts.org/api/v0/product';

class NutritionApiService {
  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await fetch(`${OPENFOODFACTS_API_BASE}/${barcode}.json`);
      const data: OpenFoodFactsProduct = await response.json();

      if (data.status !== 1 || !data.product) {
        return null;
      }

      return this.transformOpenFoodFactsProduct(data);
    } catch (error) {
      console.error('Error fetching product data:', error);
      throw new Error('Failed to fetch product information');
    }
  }

  private transformOpenFoodFactsProduct(data: OpenFoodFactsProduct): Product {
    const { product } = data;
    const nutriments = product.nutriments || {};

    // Convert per 100g values to per serving if serving size is available
    const servingSize = product.serving_size || '100g';
    const servingMultiplier = this.getServingMultiplier(servingSize);

    const nutrients = {
      totalFat: this.createNutrientInfo(nutriments['fat_100g'], 'g', servingMultiplier, 65),
      saturatedFat: this.createNutrientInfo(nutriments['saturated-fat_100g'], 'g', servingMultiplier, 20),
      sodium: this.createNutrientInfo(nutriments['sodium_100g'], 'mg', servingMultiplier * 1000, 2300),
      totalCarbs: this.createNutrientInfo(nutriments['carbohydrates_100g'], 'g', servingMultiplier, 300),
      fiber: this.createNutrientInfo(nutriments['fiber_100g'], 'g', servingMultiplier, 25),
      sugars: this.createNutrientInfo(nutriments['sugars_100g'], 'g', servingMultiplier),
      protein: this.createNutrientInfo(nutriments['proteins_100g'], 'g', servingMultiplier, 50),
    };

    const calories = Math.round((nutriments['energy-kcal_100g'] || 0) * servingMultiplier);
    const healthScore = this.calculateHealthScore(nutrients, product.nutriscore_grade);
    const aiInsights = this.generateAIInsights(nutrients, healthScore, product.nutriscore_grade);

    return {
      id: data.code,
      name: product.product_name || 'Unknown Product',
      brand: product.brands || 'Unknown Brand',
      barcode: data.code,
      servingSize,
      calories,
      nutrients,
      aiInsights,
      healthScore,
      imageUrl: product.image_url,
    };
  }

  private createNutrientInfo(
    value: number | undefined, 
    unit: string, 
    multiplier: number, 
    dailyValue?: number
  ): NutrientInfo {
    const actualValue = (value || 0) * multiplier;
    const dvPercentage = dailyValue ? Math.round((actualValue / dailyValue) * 100) : undefined;

    return {
      value: Math.round(actualValue * 10) / 10, // Round to 1 decimal place
      unit,
      dailyValue: dvPercentage,
    };
  }

  private getServingMultiplier(servingSize: string): number {
    // Extract numeric value from serving size string
    const match = servingSize.match(/(\d+(?:\.\d+)?)/);
    if (!match) return 1;

    const value = parseFloat(match[1]);
    
    // Convert to multiplier based on unit (assuming 100g base)
    if (servingSize.includes('g')) {
      return value / 100;
    } else if (servingSize.includes('ml')) {
      return value / 100; // Assuming 1ml ≈ 1g for most foods
    }
    
    return 1; // Default multiplier
  }

  private calculateHealthScore(nutrients: any, nutriscoreGrade?: string): number {
    let score = 5.0; // Base score

    // Nutriscore grade bonus/penalty
    if (nutriscoreGrade) {
      const gradeScores = { 'a': 2, 'b': 1, 'c': 0, 'd': -1, 'e': -2 };
      score += gradeScores[nutriscoreGrade.toLowerCase() as keyof typeof gradeScores] || 0;
    }

    // Fiber bonus
    if (nutrients.fiber.value >= 3) score += 1;
    if (nutrients.fiber.value >= 5) score += 0.5;

    // Protein bonus
    if (nutrients.protein.value >= 10) score += 0.5;
    if (nutrients.protein.value >= 20) score += 0.5;

    // Sodium penalty
    if (nutrients.sodium.dailyValue && nutrients.sodium.dailyValue > 20) score -= 1;
    if (nutrients.sodium.dailyValue && nutrients.sodium.dailyValue > 40) score -= 1;

    // Saturated fat penalty
    if (nutrients.saturatedFat.dailyValue && nutrients.saturatedFat.dailyValue > 15) score -= 0.5;
    if (nutrients.saturatedFat.dailyValue && nutrients.saturatedFat.dailyValue > 25) score -= 0.5;

    // Sugar penalty
    if (nutrients.sugars.value > 15) score -= 0.5;
    if (nutrients.sugars.value > 25) score -= 1;

    return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
  }

  private generateAIInsights(nutrients: any, healthScore: number, nutriscoreGrade?: string): string[] {
    const insights: string[] = [];

    // Health score insights
    if (healthScore >= 8) {
      insights.push('Excellent nutritional profile - great choice!');
    } else if (healthScore >= 6) {
      insights.push('Good nutritional balance with room for improvement');
    } else if (healthScore >= 4) {
      insights.push('Moderate nutritional value - consume in moderation');
    } else {
      insights.push('Consider healthier alternatives when possible');
    }

    // Fiber insights
    if (nutrients.fiber.value >= 5) {
      insights.push('High in fiber - excellent for digestive health');
    } else if (nutrients.fiber.value >= 3) {
      insights.push('Good source of fiber');
    }

    // Protein insights
    if (nutrients.protein.value >= 20) {
      insights.push('High protein content - great for muscle health');
    } else if (nutrients.protein.value >= 10) {
      insights.push('Good source of protein');
    }

    // Sodium insights
    if (nutrients.sodium.dailyValue && nutrients.sodium.dailyValue > 30) {
      insights.push('High sodium content - monitor daily intake');
    } else if (nutrients.sodium.dailyValue && nutrients.sodium.dailyValue < 5) {
      insights.push('Low sodium - heart-healthy choice');
    }

    // Sugar insights
    if (nutrients.sugars.value > 20) {
      insights.push('High sugar content - limit consumption');
    } else if (nutrients.sugars.value < 5) {
      insights.push('Low sugar content');
    }

    // Saturated fat insights
    if (nutrients.saturatedFat.dailyValue && nutrients.saturatedFat.dailyValue > 20) {
      insights.push('High in saturated fat - consume sparingly');
    } else if (nutrients.saturatedFat.dailyValue && nutrients.saturatedFat.dailyValue < 5) {
      insights.push('Low in saturated fat');
    }

    // Nutriscore insights
    if (nutriscoreGrade) {
      const grade = nutriscoreGrade.toLowerCase();
      if (grade === 'a') {
        insights.push('Nutri-Score A - highest nutritional quality');
      } else if (grade === 'e') {
        insights.push('Nutri-Score E - consider healthier alternatives');
      }
    }

    return insights.slice(0, 4); // Limit to 4 insights
  }
}

export const nutritionApi = new NutritionApiService();
