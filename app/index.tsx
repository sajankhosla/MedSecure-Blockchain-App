import React from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { BlockchainProvider } from './context/BlockchainContext';

/**
 * Entry point of the application
 * Redirects to the welcome screen
 */

export default function App() {
  return (
    <BlockchainProvider>
      <Redirect href="/welcome" />
    </BlockchainProvider>
  );
} 