import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ethers } from 'ethers';

// Define the context types
export interface ConsentData {
  id: string;
  dataType: string;
  purpose: string;
  organization: string;
  dateGranted: Date;
  expirationDate?: Date;
  status: 'granted' | 'revoked' | 'expired';
}

export interface BlockchainContextType {
  isAuthenticated: boolean;
  wallet: ethers.Wallet | null;
  address: string | null;
  isLoading: boolean;
  consents: ConsentData[];
  error: string | null;
  createWallet: () => Promise<void>;
  importWallet: (privateKey: string) => Promise<void>;
  logout: () => Promise<void>;
  grantConsent: (consentData: Omit<ConsentData, 'id' | 'dateGranted' | 'status'>) => Promise<void>;
  revokeConsent: (consentId: string) => Promise<void>;
}

// Create the context with default values
export const BlockchainContext = createContext<BlockchainContextType>({
  isAuthenticated: false,
  wallet: null,
  address: null,
  isLoading: false,
  consents: [],
  error: null,
  createWallet: async () => {},
  importWallet: async () => {},
  logout: async () => {},
  grantConsent: async () => {},
  revokeConsent: async () => {},
});

// Storage keys
const PRIVATE_KEY_STORAGE_KEY = 'pharma_blockchain_private_key';
const CONSENTS_STORAGE_KEY = 'pharma_blockchain_consents';

// Provider component
export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [consents, setConsents] = useState<ConsentData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        setIsLoading(true);
        
        // Try to retrieve the private key
        const privateKey = await SecureStore.getItemAsync(PRIVATE_KEY_STORAGE_KEY);
        if (privateKey) {
          // Create wallet from the private key
          const walletInstance = new ethers.Wallet(privateKey);
          setWallet(walletInstance);
          setAddress(walletInstance.address);

          // Load consents
          const storedConsents = await SecureStore.getItemAsync(CONSENTS_STORAGE_KEY);
          if (storedConsents) {
            setConsents(JSON.parse(storedConsents));
          }
        }
      } catch (err) {
        setError('Failed to initialize wallet');
        console.error('Error initializing wallet:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWallet();
  }, []);

  // Create new wallet
  const createWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate a random wallet
      const walletInstance = ethers.Wallet.createRandom();
      setWallet(walletInstance);
      setAddress(walletInstance.address);
      
      // Store the private key securely
      await SecureStore.setItemAsync(PRIVATE_KEY_STORAGE_KEY, walletInstance.privateKey);
      
      // Initialize empty consents
      await SecureStore.setItemAsync(CONSENTS_STORAGE_KEY, JSON.stringify([]));
      setConsents([]);
    } catch (err) {
      setError('Failed to create wallet');
      console.error('Error creating wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Import existing wallet
  const importWallet = async (privateKey: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate the private key
      if (!privateKey.startsWith('0x')) {
        privateKey = `0x${privateKey}`;
      }
      
      // Create wallet from the private key
      const walletInstance = new ethers.Wallet(privateKey);
      setWallet(walletInstance);
      setAddress(walletInstance.address);
      
      // Store the private key securely
      await SecureStore.setItemAsync(PRIVATE_KEY_STORAGE_KEY, walletInstance.privateKey);
      
      // Initialize empty consents
      await SecureStore.setItemAsync(CONSENTS_STORAGE_KEY, JSON.stringify([]));
      setConsents([]);
    } catch (err) {
      setError('Invalid private key');
      console.error('Error importing wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout - clear wallet and storage
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Clear storage
      await SecureStore.deleteItemAsync(PRIVATE_KEY_STORAGE_KEY);
      await SecureStore.deleteItemAsync(CONSENTS_STORAGE_KEY);
      
      // Clear state
      setWallet(null);
      setAddress(null);
      setConsents([]);
    } catch (err) {
      setError('Failed to logout');
      console.error('Error during logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Grant consent for data usage
  const grantConsent = async (consentData: Omit<ConsentData, 'id' | 'dateGranted' | 'status'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate unique ID
      const id = Date.now().toString();
      
      // Create consent record
      const newConsent: ConsentData = {
        ...consentData,
        id,
        dateGranted: new Date(),
        status: 'granted',
      };
      
      // Update consents
      const updatedConsents = [...consents, newConsent];
      setConsents(updatedConsents);
      
      // Store updated consents
      await SecureStore.setItemAsync(CONSENTS_STORAGE_KEY, JSON.stringify(updatedConsents));
      
      // In a real implementation, this would interact with a smart contract
      console.log(`Consent granted for ${consentData.dataType} to ${consentData.organization}`);
    } catch (err) {
      setError('Failed to grant consent');
      console.error('Error granting consent:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Revoke previously granted consent
  const revokeConsent = async (consentId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Find and update the consent
      const updatedConsents = consents.map(consent => 
        consent.id === consentId 
          ? { ...consent, status: 'revoked' as const } 
          : consent
      );
      
      // Update state
      setConsents(updatedConsents);
      
      // Store updated consents
      await SecureStore.setItemAsync(CONSENTS_STORAGE_KEY, JSON.stringify(updatedConsents));
      
      // In a real implementation, this would interact with a smart contract
      console.log(`Consent revoked: ${consentId}`);
    } catch (err) {
      setError('Failed to revoke consent');
      console.error('Error revoking consent:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value: BlockchainContextType = {
    isAuthenticated: !!wallet,
    wallet,
    address,
    isLoading,
    consents,
    error,
    createWallet,
    importWallet,
    logout,
    grantConsent,
    revokeConsent,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

// Custom hook for using the blockchain context
export const useBlockchain = () => useContext(BlockchainContext); 