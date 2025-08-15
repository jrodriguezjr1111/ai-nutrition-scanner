import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
  isActive: boolean;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onBarcodeScanned,
  isActive,
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      
      if (cameraPermission === 'not-determined') {
        const newCameraPermission = await Camera.requestCameraPermission();
        setHasPermission(newCameraPermission === 'granted');
      } else {
        setHasPermission(cameraPermission === 'granted');
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
      Alert.alert('Permission Error', 'Unable to access camera permissions');
    }
  };

  const handleBarcodeDetected = (barcode: string) => {
    if (barcode && isActive) {
      onBarcodeScanned(barcode);
    }
  };

  // Frame processor for barcode detection
  // Note: This is a placeholder - actual barcode detection would require
  // additional libraries like react-native-vision-camera-code-scanner
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    
    // Placeholder for barcode detection logic
    // In a real implementation, you would use a barcode detection library here
    // For now, we'll simulate barcode detection after a delay
    
    // This is just for demonstration - remove in production
    if (Math.random() < 0.001) { // Very low probability to simulate occasional detection
      runOnJS(handleBarcodeDetected)('1234567890123');
    }
  }, [isActive]);

  const onCameraInitialized = () => {
    setIsInitialized(true);
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan barcodes
        </Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          No camera device available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={isActive && hasPermission}
        onInitialized={onCameraInitialized}
        frameProcessor={frameProcessor}
      />
      
      {/* Scanning overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        
        <Text style={styles.instructionText}>
          Position barcode within the frame
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
