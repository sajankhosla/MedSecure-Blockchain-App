import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Colors, Typography, SpacingSystem } from '../theme';
import { Button, Card } from '../components';
import { useBlockchain } from '../context/BlockchainContext';

const { spacing, borderRadius } = SpacingSystem;

const DashboardScreen = () => {
  const { 
    address, 
    consents, 
    revokeConsent, 
    logout, 
    isLoading 
  } = useBlockchain();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRevokeConsent = (consentId: string, dataType: string) => {
    Alert.alert(
      'Revoke Consent',
      `Are you sure you want to revoke consent for ${dataType}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Revoke', 
          style: 'destructive',
          onPress: async () => {
            try {
              await revokeConsent(consentId);
            } catch (error) {
              Alert.alert('Error', 'Failed to revoke consent. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out? You will need your private key to access your account again.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // In a real app, we would refresh the blockchain data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Health Data</Text>
            <Text style={styles.walletAddress}>
              Wallet: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={Colors.system.red.light} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Ionicons name="document-text-outline" size={32} color={Colors.primary.light} />
            <Text style={styles.statTitle}>{consents.filter(c => c.status === 'granted').length}</Text>
            <Text style={styles.statLabel}>Active Consents</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Ionicons name="shield-checkmark-outline" size={32} color={Colors.primary.light} />
            <Text style={styles.statTitle}>Secure</Text>
            <Text style={styles.statLabel}>Blockchain Status</Text>
          </Card>
        </View>
        
        <Text style={styles.sectionTitle}>Active Consents</Text>
        <Text style={styles.sectionDescription}>
          Review and manage the data you've consented to share for clinical research.
        </Text>
        
        {consents.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Active Consents</Text>
            <Text style={styles.emptyDescription}>
              You haven't granted consent for any data yet. Scan a study QR code to get started.
            </Text>
            <Button 
              title="Scan QR Code" 
              onPress={() => router.push('/scan')}
              style={styles.emptyButton}
            />
          </Card>
        ) : (
          <View style={styles.consentList}>
            {consents.map((consent) => (
              <Card key={consent.id} variant="outlined" style={styles.consentCard}>
                <View style={styles.consentHeader}>
                  <View>
                    <Text style={styles.consentTitle}>
                      {consent.dataType.replace('_', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Text>
                    <Text style={styles.consentMeta}>
                      Granted: {new Date(consent.dateGranted).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    consent.status === 'granted' ? styles.statusActive : styles.statusRevoked,
                  ]}>
                    <Text style={styles.statusText}>{consent.status}</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.consentDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Organization:</Text>
                    <Text style={styles.detailValue}>{consent.organization}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Purpose:</Text>
                    <Text style={styles.detailValue}>{consent.purpose}</Text>
                  </View>
                  {consent.expirationDate && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Expires:</Text>
                      <Text style={styles.detailValue}>
                        {new Date(consent.expirationDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>
                
                {consent.status === 'granted' && (
                  <Button 
                    title="Revoke Consent" 
                    variant="outline"
                    onPress={() => handleRevokeConsent(consent.id, consent.dataType)}
                    style={styles.revokeButton}
                  />
                )}
              </Card>
            ))}
          </View>
        )}
        
        <View style={styles.actionsContainer}>
          <Button 
            title="Scan New QR Code" 
            leftIcon={<Ionicons name="scan-outline" size={20} color="#FFFFFF" />}
            onPress={() => router.push('/scan')}
            style={styles.actionButton}
          />
        </View>
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
    paddingBottom: spacing['4xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
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
  logoutButton: {
    padding: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statTitle: {
    ...Typography.title3,
    color: Colors.text.light.primary,
    marginTop: spacing.sm,
  },
  statLabel: {
    ...Typography.caption1,
    color: Colors.text.light.tertiary,
  },
  sectionTitle: {
    ...Typography.headline,
    color: Colors.text.light.primary,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    ...Typography.body,
    color: Colors.text.light.secondary,
    marginBottom: spacing.lg,
  },
  emptyCard: {
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    ...Typography.headline,
    color: Colors.text.light.primary,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...Typography.body,
    color: Colors.text.light.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    minWidth: 150,
  },
  consentList: {
    marginBottom: spacing.xl,
  },
  consentCard: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  consentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.md,
  },
  consentTitle: {
    ...Typography.headline,
    color: Colors.text.light.primary,
  },
  consentMeta: {
    ...Typography.footnote,
    color: Colors.text.light.tertiary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusActive: {
    backgroundColor: Colors.success + '20', // 20% opacity
  },
  statusRevoked: {
    backgroundColor: Colors.system.red.light + '20', // 20% opacity
  },
  statusText: {
    ...Typography.caption2,
    textTransform: 'uppercase',
    color: Colors.text.light.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.system.gray.light + '40', // 40% opacity
  },
  consentDetails: {
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    ...Typography.callout,
    color: Colors.text.light.secondary,
    width: 100,
  },
  detailValue: {
    ...Typography.callout,
    color: Colors.text.light.primary,
    flex: 1,
  },
  revokeButton: {
    margin: spacing.md,
  },
  actionsContainer: {
    marginTop: spacing.lg,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
});

export default DashboardScreen; 