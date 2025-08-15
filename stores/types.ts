export interface NutrientInfo {
  value: number;
  unit: string;
  dailyValue?: number;
}

export interface ProductNutrients {
  totalFat: NutrientInfo;
  saturatedFat: NutrientInfo;
  sodium: NutrientInfo;
  totalCarbs: NutrientInfo;
  fiber: NutrientInfo;
  sugars: NutrientInfo;
  protein: NutrientInfo;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  barcode: string;
  servingSize: string;
  calories: number;
  nutrients: ProductNutrients;
  aiInsights: string[];
  healthScore: number;
  imageUrl?: string;
}

export interface LogEntry {
  id: string;
  productId: string;
  product: Product;
  timestamp: Date;
  servingSize: string;
  calories: number;
  healthScore: number;
}

export interface ScanState {
  isScanning: boolean;
  currentProduct: Product | null;
  error: string | null;
}

export interface LogState {
  entries: LogEntry[];
  selectedDate: 'today' | 'week' | 'month';
}

export interface AppSettings {
  dailyCalorieGoal: number;
  healthScoreThreshold: number;
  notifications: boolean;
}
