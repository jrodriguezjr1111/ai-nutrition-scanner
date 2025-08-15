import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [isScanning, setIsScanning] = useState(false);

  const handleScanPress = () => {
    setIsScanning(true);
    // TODO: Implement camera scanning functionality
    Alert.alert(
      'Scanner Ready',
      'Camera functionality will be implemented here. This will scan barcodes and analyze nutrition information.',
      [{ text: 'OK', onPress: () => setIsScanning(false) }]
    );
  };

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
            {isScanning ? 'Scanning...' : 'Position barcode in frame'}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.controls}>
        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanButtonActive]}
          onPress={handleScanPress}
          disabled={isScanning}
        >
          <ThemedText style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Start Scan'}
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
});
