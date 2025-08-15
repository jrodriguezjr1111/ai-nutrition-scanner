import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ScanResultScreen() {
  // Mock data for demonstration
  const mockProduct = {
    name: 'Organic Whole Wheat Bread',
    brand: 'Nature\'s Best',
    barcode: '1234567890123',
    servingSize: '1 slice (28g)',
    calories: 80,
    nutrients: {
      totalFat: { value: 1.5, unit: 'g', dailyValue: 2 },
      saturatedFat: { value: 0.3, unit: 'g', dailyValue: 2 },
      sodium: { value: 150, unit: 'mg', dailyValue: 7 },
      totalCarbs: { value: 15, unit: 'g', dailyValue: 5 },
      fiber: { value: 3, unit: 'g', dailyValue: 11 },
      sugars: { value: 2, unit: 'g', dailyValue: null },
      protein: { value: 4, unit: 'g', dailyValue: 8 },
    },
    aiInsights: [
      'High in fiber - good for digestive health',
      'Low in saturated fat',
      'Moderate sodium content - consider for daily intake',
      'Good source of protein for a bread product',
    ],
    healthScore: 8.2,
  };

  const handleSaveToLog = () => {
    // TODO: Implement save to log functionality
    console.log('Saving to log...');
  };

  const handleScanAnother = () => {
    // TODO: Navigate back to scanner
    console.log('Scanning another product...');
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
          {mockProduct.name}
        </ThemedText>
        <ThemedText style={styles.brand}>{mockProduct.brand}</ThemedText>
        <ThemedText style={styles.barcode}>Barcode: {mockProduct.barcode}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.nutritionCard}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Nutrition Facts
        </ThemedText>
        <ThemedText style={styles.servingSize}>Per {mockProduct.servingSize}</ThemedText>
        
        <ThemedView style={styles.caloriesRow}>
          <ThemedText style={styles.caloriesLabel}>Calories</ThemedText>
          <ThemedText style={styles.caloriesValue}>{mockProduct.calories}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.nutrientsContainer}>
          {Object.entries(mockProduct.nutrients).map(([key, nutrient]) => (
            <ThemedView key={key} style={styles.nutrientRow}>
              <ThemedText style={styles.nutrientName}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </ThemedText>
              <ThemedText style={styles.nutrientValue}>
                {nutrient.value}{nutrient.unit}
                {nutrient.dailyValue && ` (${nutrient.dailyValue}% DV)`}
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
          <ThemedText style={styles.healthScore}>{mockProduct.healthScore}/10</ThemedText>
        </ThemedView>
        
        {mockProduct.aiInsights.map((insight, index) => (
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
});
