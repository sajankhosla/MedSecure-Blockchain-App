import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, SpacingSystem } from '../theme';
import { Button } from '../components';

const { spacing, borderRadius } = SpacingSystem;

interface ScanResult {
  type: string;
  data: string;
}

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: ScanResult) => {
    setScanned(true);
    setScanning(false);
    
    try {
      // In a real app, we would validate the QR code data here
      // For this mock-up, we'll just move to the next screen
      console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
      
      // Navigate to wallet setup screen
      router.push('/setup-wallet');
    } catch (error) {
      Alert.alert('Invalid QR Code', 'The scanned QR code is not valid for this application.');
    }
  };

  const startScanning = () => {
    setScanning(true);
    setScanned(false);
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        
        <View style={styles.overlay}>
          <View style={styles.unfilled} />
          <View style={styles.scannerRow}>
            <View style={styles.unfilled} />
            <View style={styles.scanner}>
              <View style={styles.scannerCorner} />
              <View style={styles.scannerCorner} />
              <View style={styles.scannerCorner} />
              <View style={styles.scannerCorner} />
            </View>
            <View style={styles.unfilled} />
          </View>
          <View style={styles.unfilled} />
        </View>
        
        {scanned && (
          <Button
            title="Tap to Scan Again"
            onPress={() => setScanned(false)}
            style={styles.scanAgainButton}
          />
        )}
      </View>
    );
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.permissionText}>Camera access is required to scan QR codes.</Text>
        <Button
          title="Request Permission"
          onPress={() => {
            BarCodeScanner.requestPermissionsAsync();
          }}
          style={styles.permissionButton}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {scanning ? (
        renderCamera()
      ) : (
        <View style={styles.instructionsContainer}>
          <Ionicons name="qr-code" size={100} color={Colors.primary.light} />
          
          <Text style={styles.title}>Scan Study QR Code</Text>
          
          <Text style={styles.instructions}>
            To begin the enrollment process, scan the QR code provided by your healthcare provider or clinical trial coordinator.
          </Text>
          
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Point your camera at the QR code</Text>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Hold steady until the code is recognized</Text>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>You'll be prompted to set up your secure account</Text>
            </View>
          </View>
          
          <Button
            title="Start Scanning"
            size="large"
            onPress={startScanning}
            style={styles.scanButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  instructionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    ...Typography.title2,
    color: Colors.text.light.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  instructions: {
    ...Typography.body,
    color: Colors.text.light.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  stepsContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stepNumberText: {
    ...Typography.subheadline,
    color: 'white',
    fontWeight: 'bold',
  },
  stepText: {
    ...Typography.body,
    color: Colors.text.light.secondary,
    flex: 1,
  },
  scanButton: {
    width: '100%',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  unfilled: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scannerRow: {
    flexDirection: 'row',
    height: 250,
  },
  scanner: {
    width: 250,
    height: 250,
    borderRadius: 16,
    position: 'relative',
  },
  scannerCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: Colors.primary.light,
    borderWidth: 3,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
  },
  permissionText: {
    ...Typography.body,
    textAlign: 'center',
    margin: spacing.lg,
    color: Colors.text.light.secondary,
  },
  permissionButton: {
    margin: spacing.md,
  },
});

export default ScanScreen; 