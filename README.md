# MedSecure: Blockchain-Based Clinical Data Consent App

A mobile application that allows patients to securely manage consent for their medical data in clinical research using blockchain technology.

## Features

- **QR Code Scanning**: Easily scan QR codes to initiate the consent process for clinical studies
- **Secure Blockchain Wallet**: Create or import blockchain wallets for secure identity management
- **Granular Consent Control**: Choose exactly which data to share and with whom
- **Consent Management**: View and revoke consent at any time
- **User-friendly Interface**: Clean, modern UI following Apple's Human Interface Guidelines

## User Flow

1. **Welcome Screen**: Introduction to the app's features and benefits
2. **QR Code Scanning**: Scan a study-specific QR code to begin the process
3. **Wallet Setup**: Create a new blockchain wallet or import an existing one
4. **Consent Management**: Review and grant consent for specific data types
5. **Dashboard**: Overview of active consents with management options

## Technical Stack

- React Native with Expo
- TypeScript for type safety
- Ethers.js for blockchain interactions
- Expo Secure Store for secure storage
- React Navigation for routing

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pharma-blockchain-app

# Install dependencies
npm install

# Start the development server
npm start
```

## Security Considerations

- Private keys are stored securely using Expo Secure Store
- All blockchain transactions are signed locally on the device
- No private keys or sensitive data are transmitted over the network
- Consents are stored on the blockchain for transparency and immutability

## Design Philosophy

The application follows Apple's Human Interface Guidelines with:

- Clean, minimal interface
- Intuitive navigation
- Clear feedback for user actions
- Accessibility features
- Dark and light mode support

## Future Enhancements

- Integration with real clinical trial systems
- Multi-signature consent requirements
- Enhanced data visualization
- Support for additional blockchain networks
- Integration with health data standards (FHIR, HL7)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
