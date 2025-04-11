import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, SpacingSystem } from '../theme';
import { Button, Card, TextInput } from '../components';
import { useBlockchain } from '../context/BlockchainContext';

const { spacing, borderRadius } = SpacingSystem;

type SetupMode = 'select' | 'create' | 'import';

const SetupWalletScreen = () => {
  const [setupMode, setSetupMode] = useState<SetupMode>('select');
  const [privateKey, setPrivateKey] = useState('');
  const [privateKeyError, setPrivateKeyError] = useState('');
  const { createWallet, importWallet, isLoading, error } = useBlockchain();

  const handleCreateWallet = async () => {
    try {
      await createWallet();
      // For web platform, use direct window location change
      if (typeof window !== 'undefined') {
        window.location.href = '/consent';
        return;
      }
      // For native platforms, use expo-router
      router.push('/consent');
    } catch (err) {
      Alert.alert('Error', 'Failed to create wallet. Please try again.');
    }
  };

  const handleImportWallet = async () => {
    if (!privateKey.trim()) {
      setPrivateKeyError('Please enter a private key');
      return;
    }

    try {
      await importWallet(privateKey);
      if (!error) {
        // For web platform, use direct window location change
        if (typeof window !== 'undefined') {
          window.location.href = '/consent';
          return;
        }
        // For native platforms, use expo-router
        router.push('/consent');
      }
    } catch (err) {
      setPrivateKeyError('Invalid private key format');
    }
  };

  const renderSelectMode = () => {
    return (
      <View style={styles.contentContainer}>
        <Ionicons name="wallet" size={80} color={Colors.primary.light} />
        
        <Text style={styles.title}>Secure Blockchain Wallet</Text>
        
        <Text style={styles.description}>
          To securely store and control your medical data, you'll need a blockchain wallet. This wallet serves as your digital identity and gives you control over your health data.
        </Text>
        
        <Card variant="filled" style={styles.card}>
          <Text style={styles.cardTitle}>Create New Wallet</Text>
          <Text style={styles.cardDescription}>
            Recommended for new users. We'll create a secure blockchain wallet for you.
          </Text>
          <Button 
            title="Create New Wallet" 
            onPress={() => setSetupMode('create')}
            style={styles.cardButton}
          />
        </Card>
        
        <Card variant="outlined" style={styles.card}>
          <Text style={styles.cardTitle}>Import Existing Wallet</Text>
          <Text style={styles.cardDescription}>
            Already have a blockchain wallet? Import it using your private key.
          </Text>
          <Button 
            title="Import Wallet" 
            variant="outline"
            onPress={() => setSetupMode('import')}
            style={styles.cardButton}
          />
        </Card>
      </View>
    );
  };

  const renderCreateWallet = () => {
    return (
      <View style={styles.contentContainer}>
        <Ionicons name="shield-checkmark" size={60} color={Colors.primary.light} />
        
        <Text style={styles.title}>Create Secure Wallet</Text>
        
        <Text style={styles.description}>
          We'll create a secure blockchain wallet for your medical data. This wallet will:
        </Text>
        
        <View style={styles.featureList}>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} style={styles.featureIcon} />
            <Text style={styles.featureText}>Securely store your identity on the blockchain</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} style={styles.featureIcon} />
            <Text style={styles.featureText}>Give you complete control over your medical data</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} style={styles.featureIcon} />
            <Text style={styles.featureText}>Allow you to grant and revoke consent easily</Text>
          </View>
        </View>
        
        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={24} color={Colors.info} style={styles.noteIcon} />
          <Text style={styles.noteText}>
            In the next step, you'll receive a recovery phrase. Keep it safe as it's the only way to recover your wallet.
          </Text>
        </View>
        
        <View style={styles.buttons}>
          <Button 
            title="Back" 
            variant="outline"
            onPress={() => setSetupMode('select')}
            style={styles.backButton}
          />
          <Button 
            title="Create Wallet" 
            isLoading={isLoading}
            onPress={handleCreateWallet}
            style={styles.actionButton}
          />
        </View>
      </View>
    );
  };

  const renderImportWallet = () => {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.contentContainer}>
          <Ionicons name="key" size={60} color={Colors.primary.light} />
          
          <Text style={styles.title}>Import Existing Wallet</Text>
          
          <Text style={styles.description}>
            Enter your private key to import your existing blockchain wallet. Never share your private key with anyone.
          </Text>
          
          <TextInput
            label="Private Key"
            value={privateKey}
            onChangeText={(text) => {
              setPrivateKey(text);
              setPrivateKeyError('');
            }}
            placeholder="Enter your private key"
            error={privateKeyError || (error ? 'Invalid private key' : '')}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          
          <View style={styles.noteCard}>
            <Ionicons name="warning" size={24} color={Colors.warning} style={styles.noteIcon} />
            <Text style={styles.noteText}>
              Keep your private key secure. Anyone with access to your private key has complete control over your wallet.
            </Text>
          </View>
          
          <View style={styles.buttons}>
            <Button 
              title="Back" 
              variant="outline"
              onPress={() => setSetupMode('select')}
              style={styles.backButton}
            />
            <Button 
              title="Import Wallet" 
              isLoading={isLoading}
              onPress={handleImportWallet}
              style={styles.actionButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {setupMode === 'select' && renderSelectMode()}
      {setupMode === 'create' && renderCreateWallet()}
      {setupMode === 'import' && renderImportWallet()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  keyboardContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...Typography.title2,
    color: Colors.text.light.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.text.light.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    width: '100%',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  cardTitle: {
    ...Typography.headline,
    color: Colors.text.light.primary,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    ...Typography.callout,
    color: Colors.text.light.secondary,
    marginBottom: spacing.md,
  },
  cardButton: {
    alignSelf: 'flex-end',
  },
  featureList: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIcon: {
    marginRight: spacing.sm,
  },
  featureText: {
    ...Typography.body,
    color: Colors.text.light.primary,
    flex: 1,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  noteIcon: {
    marginRight: spacing.sm,
  },
  noteText: {
    ...Typography.callout,
    color: Colors.text.light.primary,
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  actionButton: {
    flex: 2,
  },
});

export default SetupWalletScreen; 