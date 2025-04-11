import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  Switch, 
  Alert,
  TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Colors, Typography, SpacingSystem } from '../theme';
import { Button, Card } from '../components';
import { useBlockchain } from '../context/BlockchainContext';

const { spacing, borderRadius } = SpacingSystem;

interface ConsentOption {
  id: string;
  title: string;
  description: string;
  required: boolean;
  selected: boolean;
}

const ConsentScreen = () => {
  const { grantConsent, address, isAuthenticated, isLoading } = useBlockchain();
  const [consentOptions, setConsentOptions] = useState<ConsentOption[]>([
    {
      id: 'demographic',
      title: 'Demographic Data',
      description: 'Share basic demographic information like age, gender, and ethnicity for research categorization.',
      required: true,
      selected: true,
    },
    {
      id: 'medical_history',
      title: 'Medical History',
      description: 'Share relevant medical history information for better contextual understanding of research findings.',
      required: true,
      selected: true,
    },
    {
      id: 'treatment_outcomes',
      title: 'Treatment Outcomes',
      description: 'Share data about how treatments affected your condition to improve future treatments.',
      required: false,
      selected: false,
    },
    {
      id: 'genetic',
      title: 'Genetic Information',
      description: 'Share de-identified genetic data for research on genetic factors in disease and treatment.',
      required: false,
      selected: false,
    },
    {
      id: 'future_research',
      title: 'Future Research',
      description: 'Allow your de-identified data to be used in future clinical research studies.',
      required: false,
      selected: false,
    },
  ]);

  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const handleToggleConsent = (id: string) => {
    setConsentOptions(options =>
      options.map(option =>
        option.id === id && !option.required
          ? { ...option, selected: !option.selected }
          : option
      )
    );
  };

  const handleSubmitConsent = async () => {
    if (!termsChecked || !privacyChecked) {
      Alert.alert(
        'Agreement Required',
        'Please agree to the Terms of Service and Privacy Policy to continue.'
      );
      return;
    }

    try {
      // Process all selected consents
      const selectedOptions = consentOptions.filter(option => option.selected);
      
      for (const option of selectedOptions) {
        await grantConsent({
          dataType: option.id,
          purpose: 'Clinical Research',
          organization: 'MedSecure Clinical Partners',
          expirationDate: new Date(Date.now() + 31536000000), // 1 year from now
        });
      }

      // Navigate to success/dashboard screen
      router.push('/dashboard');
    } catch (error) {
      Alert.alert(
        'Error Submitting Consent',
        'There was an error processing your consent. Please try again.'
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color={Colors.system.red.light} />
          <Text style={styles.errorTitle}>Authentication Required</Text>
          <Text style={styles.errorMessage}>
            You need to set up a secure blockchain wallet before providing consent.
          </Text>
          <Button 
            title="Set Up Wallet" 
            onPress={() => router.push('/setup-wallet')}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Data Consent</Text>
          <Text style={styles.walletAddress}>
            Wallet: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
          </Text>
        </View>
        
        <Text style={styles.description}>
          Control which data you share with researchers. Your data is securely stored and
          can only be accessed with your explicit consent.
        </Text>
        
        <View style={styles.consentList}>
          {consentOptions.map((option) => (
            <Card key={option.id} variant="outlined" style={styles.consentCard}>
              <View style={styles.consentHeader}>
                <View>
                  <Text style={styles.consentTitle}>{option.title}</Text>
                  {option.required && (
                    <Text style={styles.requiredBadge}>Required</Text>
                  )}
                </View>
                <Switch
                  value={option.selected}
                  onValueChange={() => handleToggleConsent(option.id)}
                  disabled={option.required}
                  trackColor={{ false: '#D1D1D6', true: Colors.primary.light }}
                  ios_backgroundColor="#D1D1D6"
                />
              </View>
              <Text style={styles.consentDescription}>{option.description}</Text>
            </Card>
          ))}
        </View>
        
        <View style={styles.legalSection}>
          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => setPrivacyChecked(!privacyChecked)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, privacyChecked && styles.checkboxChecked]}>
              {privacyChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxText}>
              I have read and agree to the <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => setTermsChecked(!termsChecked)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, termsChecked && styles.checkboxChecked]}>
              {termsChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxText}>
              I have read and agree to the <Text style={styles.link}>Terms of Service</Text>
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={24} color={Colors.info} style={styles.noteIcon} />
          <Text style={styles.noteText}>
            You can change your consent preferences at any time from your dashboard.
          </Text>
        </View>
        
        <Button 
          title="Submit Consent" 
          size="large"
          onPress={handleSubmitConsent}
          isLoading={isLoading}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    ...Typography.title2,
    color: Colors.text.light.primary,
  },
  walletAddress: {
    ...Typography.callout,
    color: Colors.text.light.tertiary,
    marginTop: spacing.xs,
  },
  description: {
    ...Typography.body,
    color: Colors.text.light.secondary,
    marginBottom: spacing.lg,
  },
  consentList: {
    marginBottom: spacing.lg,
  },
  consentCard: {
    marginBottom: spacing.md,
  },
  consentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  consentTitle: {
    ...Typography.headline,
    color: Colors.text.light.primary,
  },
  requiredBadge: {
    ...Typography.caption1,
    color: Colors.primary.light,
    marginTop: spacing.xs,
  },
  consentDescription: {
    ...Typography.body,
    color: Colors.text.light.secondary,
  },
  legalSection: {
    marginBottom: spacing.lg,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.system.gray.light,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.light,
  },
  checkboxText: {
    ...Typography.callout,
    color: Colors.text.light.primary,
    flex: 1,
  },
  link: {
    color: Colors.primary.light,
    textDecorationLine: 'underline',
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  noteIcon: {
    marginRight: spacing.sm,
  },
  noteText: {
    ...Typography.callout,
    color: Colors.text.light.primary,
    flex: 1,
  },
  submitButton: {
    marginBottom: spacing.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorTitle: {
    ...Typography.title3,
    color: Colors.text.light.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    ...Typography.body,
    color: Colors.text.light.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  errorButton: {
    minWidth: 200,
  },
});

export default ConsentScreen; 