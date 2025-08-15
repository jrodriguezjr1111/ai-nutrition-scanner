import { create } from 'zustand';
import { Product, ScanState } from './types';

interface ScanStore extends ScanState {
  // Actions
  startScanning: () => void;
  stopScanning: () => void;
  setCurrentProduct: (product: Product | null) => void;
  setError: (error: string | null) => void;
  clearScan: () => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  // Initial state
  isScanning: false,
  currentProduct: null,
  error: null,

  // Actions
  startScanning: () => set({ isScanning: true, error: null }),
  
  stopScanning: () => set({ isScanning: false }),
  
  setCurrentProduct: (product) => set({ 
    currentProduct: product, 
    isScanning: false,
    error: null 
  }),
  
  setError: (error) => set({ 
    error, 
    isScanning: false,
    currentProduct: null 
  }),
  
  clearScan: () => set({ 
    currentProduct: null, 
    error: null, 
    isScanning: false 
  }),
}));
