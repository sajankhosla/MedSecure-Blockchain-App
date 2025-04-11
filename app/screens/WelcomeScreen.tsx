import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Colors, Typography, SpacingSystem } from '../theme';
import { Button } from '../components';

const { spacing, borderRadius } = SpacingSystem;

const WelcomeScreen = () => {
  const colorScheme = useColorScheme() as 'light' | 'dark';

  const handleGetStarted = () => {
    // For web platform, use direct window location change
    if (typeof window !== 'undefined') {
      window.location.href = '/scan';
      return;
    }
    // For native platforms, use expo-router
    router.push('/scan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colorScheme === 'dark' 
          ? [Colors.primary.dark, '#032852'] 
          : [Colors.primary.light, '#0250a3']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Ionicons 
            name="medkit" 
            size={60} 
            color="#fff" 
          />
          <Text style={styles.title}>MedSecure</Text>
          <Text style={styles.subtitle}>Secure Clinical Data Sharing</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={32} color={Colors.primary.light} />
            </View>
            <Text style={[styles.cardTitle, colorScheme === 'dark' && { color: Colors.text.dark.primary }]}>
              Secure Blockchain Identity
            </Text>
            <Text style={[styles.cardText, colorScheme === 'dark' && { color: Colors.text.dark.secondary }]}>
              Your medical data is secured with blockchain technology, giving you complete control.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="scan" size={32} color={Colors.primary.light} />
            </View>
            <Text style={[styles.cardTitle, colorScheme === 'dark' && { color: Colors.text.dark.primary }]}>
              Simple QR Code Access
            </Text>
            <Text style={[styles.cardText, colorScheme === 'dark' && { color: Colors.text.dark.secondary }]}>
              Easily share your data with healthcare providers via secure QR codes.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-text" size={32} color={Colors.primary.light} />
            </View>
            <Text style={[styles.cardTitle, colorScheme === 'dark' && { color: Colors.text.dark.primary }]}>
              Granular Consent Control
            </Text>
            <Text style={[styles.cardText, colorScheme === 'dark' && { color: Colors.text.dark.secondary }]}>
              Choose exactly what data is shared and with whom, with complete transparency.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button 
            title="Get Started" 
            variant="primary"
            size="large"
            style={styles.button}
            onPress={handleGetStarted}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...Typography.largeTitle,
    color: '#FFFFFF',
    marginTop: spacing.md,
  },
  subtitle: {
    ...Typography.headline,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...Typography.headline,
    color: Colors.text.light.primary,
    marginBottom: spacing.xs,
  },
  cardText: {
    ...Typography.body,
    color: Colors.text.light.secondary,
  },
  footer: {
    marginTop: spacing.lg,
  },
  button: {
    borderRadius: borderRadius.full,
    backgroundColor: '#FFFFFF',
  },
});

export default WelcomeScreen; 