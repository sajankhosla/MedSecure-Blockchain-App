import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { BlockchainProvider } from './context/BlockchainContext';

export default function RootLayout() {
  return (
    <BlockchainProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="scan" options={{ headerShown: false }} />
        <Stack.Screen name="setup-wallet" options={{ headerShown: false }} />
        <Stack.Screen name="consent" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      </Stack>
    </BlockchainProvider>
  );
}
