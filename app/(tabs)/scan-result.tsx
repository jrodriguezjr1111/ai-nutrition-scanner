import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useScanStore } from '@/stores/scanStore';
import { useLogStore } from '@/stores/logStore';

export default function ScanResultScreen() {
  const router = useRouter();
  const { currentProduct, clearScan } = useScanStore();
  const { addEntry } = useLogStore();

  // If no product is scanned, show empty state
  if (!currentProduct) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>No scan results</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Go to the Scanner tab to scan a product
          </ThemedText>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push('/')}
          >
            <ThemedText style={styles.scanButtonText}>Start Scanning</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  const handleSaveToLog = () => {
    try {
      addEntry(currentProduct);
      Alert.alert(
        'Saved!',
        'Product has been added to your daily log.',
        [
          {
            text: 'View Log',
            onPress: () => router.push('/log'),
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save product to log. Please try again.');
    }
  };

  const handleScanAnother = () => {
    clearScan();
    router.push('/');
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Scan Results
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.productCard}>
        <ThemedText type="subtitle" style={styles.productName}>
          {currentProduct.name}
        </ThemedText>
        <ThemedText style={styles.brand}>{currentProduct.brand}</ThemedText>
        <ThemedText style={styles.barcode}>Barcode: {currentProduct.barcode}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.nutritionCard}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Nutrition Facts
        </ThemedText>
        <ThemedText style={styles.servingSize}>Per {currentProduct.servingSize}</ThemedText>
        
        <ThemedView style={styles.caloriesRow}>
          <ThemedText style={styles.caloriesLabel}>Calories</ThemedText>
          <ThemedText style={styles.caloriesValue}>{currentProduct.calories}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.nutrientsContainer}>
          {Object.entries(currentProduct.nutrients).map(([key, nutrient]) => (
            <ThemedView key={key} style={styles.nutrientRow}>
              <ThemedText style={styles.nutrientName}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </ThemedText>
              <ThemedText style={styles.nutrientValue}>
                {(nutrient as any).value}{(nutrient as any).unit}
                {(nutrient as any).dailyValue && ` (${(nutrient as any).dailyValue}% DV)`}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.aiCard}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          AI Health Insights
        </ThemedText>
        <ThemedView style={styles.healthScoreContainer}>
          <ThemedText style={styles.healthScoreLabel}>Health Score</ThemedText>
          <ThemedText style={styles.healthScore}>{currentProduct.healthScore}/10</ThemedText>
        </ThemedView>
        
        {currentProduct.aiInsights.map((insight: string, index: number) => (
          <ThemedView key={index} style={styles.insightRow}>
            <ThemedText style={styles.insightBullet}>•</ThemedText>
            <ThemedText style={styles.insightText}>{insight}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.actions}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveToLog}>
          <ThemedText style={styles.saveButtonText}>Save to Log</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.scanButton} onPress={handleScanAnother}>
          <ThemedText style={styles.scanButtonText}>Scan Another</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  title: {
    textAlign: 'center',
  },
  productCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  productName: {
    marginBottom: 5,
  },
  brand: {
    opacity: 0.7,
    marginBottom: 5,
  },
  barcode: {
    opacity: 0.5,
    fontSize: 12,
  },
  nutritionCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  sectionTitle: {
    marginBottom: 15,
  },
  servingSize: {
    opacity: 0.7,
    marginBottom: 15,
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 15,
  },
  caloriesLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  caloriesValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  nutrientsContainer: {
    gap: 8,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  nutrientName: {
    flex: 1,
  },
  nutrientValue: {
    fontWeight: '500',
  },
  aiCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  healthScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
  },
  healthScoreLabel: {
    fontWeight: '600',
  },
  healthScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  insightBullet: {
    marginRight: 8,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    gap: 15,
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    opacity: 0.7,
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.5,
    marginBottom: 30,
    lineHeight: 20,
  },
});
