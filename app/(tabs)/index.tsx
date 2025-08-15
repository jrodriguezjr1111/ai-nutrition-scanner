import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { useScanStore } from '@/stores/scanStore';
import { nutritionApi } from '@/services/nutritionApi';

export default function HomeScreen() {
  const router = useRouter();
  const { isScanning, startScanning, stopScanning, setCurrentProduct, setError } = useScanStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleScanPress = () => {
    startScanning();
  };

  const handleStopScan = () => {
    stopScanning();
  };

  const handleBarcodeScanned = async (barcode: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    stopScanning();

    try {
      const product = await nutritionApi.getProductByBarcode(barcode);
      
      if (product) {
        setCurrentProduct(product);
        router.push('/scan-result');
      } else {
        Alert.alert(
          'Product Not Found',
          'We couldn\'t find nutrition information for this product. Please try another barcode.',
          [{ text: 'OK', onPress: () => startScanning() }]
        );
      }
    } catch (error) {
      setError('Failed to fetch product information. Please check your internet connection and try again.');
      Alert.alert(
        'Error',
        'Failed to fetch product information. Please try again.',
        [{ text: 'OK', onPress: () => startScanning() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isScanning) {
    return (
      <ThemedView style={styles.container}>
        <BarcodeScanner
          onBarcodeScanned={handleBarcodeScanned}
          isActive={isScanning && !isLoading}
        />
        
        {isLoading && (
          <ThemedView style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={styles.loadingText}>
              Analyzing product...
            </ThemedText>
          </ThemedView>
        )}
        
        <ThemedView style={styles.scanControls}>
          <TouchableOpacity
            style={styles.stopButton}
            onPress={handleStopScan}
            disabled={isLoading}
          >
            <ThemedText style={styles.stopButtonText}>
              Stop Scanning
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          AI Nutrition Scanner
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Scan barcodes to get instant nutrition analysis
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.scanArea}>
        <ThemedView style={styles.scanFrame}>
          <ThemedText style={styles.scanText}>
            Ready to scan
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.controls}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScanPress}
        >
          <ThemedText style={styles.scanButtonText}>
            Start Scanning
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.instructions}>
          Point your camera at a food product barcode to get detailed nutrition information and AI-powered health insights.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  scanText: {
    textAlign: 'center',
    opacity: 0.8,
  },
  controls: {
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  scanButtonActive: {
    backgroundColor: '#0056CC',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  instructions: {
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 15,
  },
  scanControls: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
