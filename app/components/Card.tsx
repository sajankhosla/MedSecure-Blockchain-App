import React from 'react';
import {
  View,
  StyleSheet,
  ViewProps,
  StyleProp,
  ViewStyle,
  useColorScheme,
} from 'react-native';

import { Colors, SpacingSystem } from '../theme';

const { borderRadius, shadow, spacing } = SpacingSystem;

export type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  style,
  children,
  padding = 'md',
  ...rest
}) => {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  
  // Get styles based on variant
  const cardStyles = [
    styles.card,
    styles[`${variant}Card`],
    { padding: spacing[padding] },
    colorScheme === 'dark' && styles.darkCard,
    style,
  ];

  return (
    <View style={cardStyles} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
  },
  // Variant styles
  elevatedCard: {
    backgroundColor: Colors.background.light,
    ...shadow.md,
  },
  outlinedCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.system.gray.light,
  },
  filledCard: {
    backgroundColor: Colors.surface.light,
  },
  // Dark mode
  darkCard: {
    backgroundColor: Colors.surface.dark,
    borderColor: Colors.system.gray.dark,
  },
});

export default Card; 