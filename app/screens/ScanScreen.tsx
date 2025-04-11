import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert, TouchableOpacity, Platform } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, SpacingSystem } from '../theme';
import { Button, Card } from '../components';

const { spacing, borderRadius } = SpacingSystem;

interface ScanResult {
  type: string;
  data: string;
}

// Mock QR code data for testing
const MOCK_QR_DATA = {
  studyId: "STUDY-2023-12345",
  organizationId: "MEDSECURE-PARTNERS",
  patientReference: "ANONYMOUS-REF-9876",
  timestamp: new Date().toISOString()
};

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [mockScanning, setMockScanning] = useState(false);
  const [mockScanCompleted, setMockScanCompleted] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  // Mock scanner effect
  useEffect(() => {
    let mockScanTimer: NodeJS.Timeout;
    
    if (mockScanning) {
      mockScanTimer = setTimeout(() => {
        setMockScanCompleted(true);
        setMockScanning(false);
        
        // Add a small delay before navigating
        setTimeout(() => {
          // Navigate to wallet setup screen
          if (typeof window !== 'undefined') {
            window.location.href = '/setup-wallet';
          } else {
            router.push('/setup-wallet');
          }
        }, 1500);
      }, 3000); // Simulate a scan taking 3 seconds
    }
    
    return () => {
      if (mockScanTimer) clearTimeout(mockScanTimer);
    };
  }, [mockScanning]);

  const handleBarCodeScanned = ({ type, data }: ScanResult) => {
    setScanned(true);
    setScanning(false);
    
    try {
      // In a real app, we would validate the QR code data here
      // For this mock-up, we'll just move to the next screen
      console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
      
      // Navigate to wallet setup screen
      // For web platform, use direct window location change
      if (typeof window !== 'undefined') {
        window.location.href = '/setup-wallet';
        return;
      }
      // For native platforms, use expo-router
      router.push('/setup-wallet');
    } catch (error) {
      Alert.alert('Invalid QR Code', 'The scanned QR code is not valid for this application.');
    }
  };

  const startScanning = () => {
    // On web, use the mock scanner instead
    if (Platform.OS === 'web') {
      setMockScanning(true);
      setMockScanCompleted(false);
      return;
    }
    
    setScanning(true);
    setScanned(false);
  };

  const renderMockScanner = () => {
    return (
      <View style={styles.cameraContainer}>
        <View style={[styles.overlay, mockScanCompleted && styles.scanComplete]}>
          <View style={styles.unfilled} />
          <View style={styles.scannerRow}>
            <View style={styles.unfilled} />
            <View style={styles.scanner}>
              {mockScanCompleted ? (
                <View style={styles.scanCompleteIcon}>
                  <Ionicons name="checkmark-circle" size={80} color="#FFFFFF" />
                  <Text style={styles.scanCompleteText}>Success!</Text>
                </View>
              ) : (
                <>
                  <View style={styles.scannerCorner} />
                  <View style={styles.scannerCorner} />
                  <View style={styles.scannerCorner} />
                  <View style={styles.scannerCorner} />
                  <View style={styles.mockData}>
                    <Text style={styles.mockDataText}>Scanning...</Text>
                    <Text style={styles.mockQrData}>
                      Study: {MOCK_QR_DATA.studyId}
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View style={styles.unfilled} />
          </View>
          <View style={styles.unfilled} />
        </View>
        
        {/* Scanning animation */}
        {mockScanning && !mockScanCompleted && (
          <View style={styles.scanLine} />
        )}
        
        {mockScanCompleted && (
          <View style={styles.scanAgainButtonContainer}>
            <Text style={styles.scanSuccessText}>QR Code Scanned Successfully</Text>
            <Text style={styles.redirectingText}>Redirecting to wallet setup...</Text>
          </View>
        )}
      </View>
    );
  };

  const renderCamera = () => {
    // Use mock scanner for web
    if (Platform.OS === 'web') {
      return renderMockScanner();
    }
    
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

  if (hasPermission === null && Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false && Platform.OS !== 'web') {
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
      
      {scanning || mockScanning ? (
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
          
          {/* Demo Card for QR Code */}
          <Card variant="filled" style={styles.demoCard}>
            <Text style={styles.demoCardTitle}>Demo QR Code</Text>
            <Text style={styles.demoCardText}>
              For demonstration purposes, you can use our mock QR code scanner to simulate the enrollment process.
            </Text>
            <View style={styles.demoQrContainer}>
              <View style={styles.demoQr}>
                <Text style={styles.demoQrInner}></Text>
                <Text style={styles.demoQrText}>MedSecure Study</Text>
                <Text style={styles.demoQrId}>{MOCK_QR_DATA.studyId}</Text>
              </View>
            </View>
          </Card>
          
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
  demoCard: {
    marginBottom: spacing.lg,
    width: '100%',
    backgroundColor: Colors.surface.light,
  },
  demoCardTitle: {
    ...Typography.headline,
    color: Colors.text.light.primary,
    marginBottom: spacing.xs,
  },
  demoCardText: {
    ...Typography.callout,
    color: Colors.text.light.secondary,
    marginBottom: spacing.md,
  },
  demoQrContainer: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  demoQr: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: Colors.text.light.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  demoQrInner: {
    width: 80,
    height: 80,
    backgroundColor: Colors.text.light.tertiary,
  },
  demoQrText: {
    ...Typography.caption1,
    marginTop: spacing.xs,
    color: Colors.text.light.primary,
  },
  demoQrId: {
    ...Typography.caption2,
    color: Colors.text.light.tertiary,
  },
  scanLine: {
    height: 2,
    width: 250,
    backgroundColor: Colors.primary.light,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -125,
    transform: [{ translateY: -125 }],
    opacity: 0.7,
  },
  scanComplete: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
  },
  scanCompleteIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanCompleteText: {
    ...Typography.title3,
    color: '#FFFFFF',
    marginTop: spacing.sm,
  },
  mockData: {
    position: 'absolute',
    alignItems: 'center',
  },
  mockDataText: {
    ...Typography.body,
    color: Colors.primary.light,
    marginBottom: spacing.xs,
  },
  mockQrData: {
    ...Typography.caption1,
    color: Colors.text.light.tertiary,
  },
  scanAgainButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanSuccessText: {
    ...Typography.headline,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  redirectingText: {
    ...Typography.callout,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});

export default ScanScreen; 