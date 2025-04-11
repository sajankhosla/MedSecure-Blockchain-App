import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useColorScheme } from 'react-native';

import { Colors, Typography, SpacingSystem } from '../theme';
const { borderRadius, spacing } = SpacingSystem;

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  ...rest
}) => {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const colors = Colors.primary[colorScheme];
  
  // Get styles based on variant and size
  const containerStyles = [
    styles.container,
    styles[`${variant}Container`],
    styles[`${size}Container`],
    disabled && styles.disabledContainer,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || isLoading}
      style={containerStyles}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading }}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : colors}
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <>
          {leftIcon && <React.Fragment>{leftIcon}</React.Fragment>}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && <React.Fragment>{rightIcon}</React.Fragment>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  // Variant styles
  primaryContainer: {
    backgroundColor: Colors.primary.light,
  },
  secondaryContainer: {
    backgroundColor: Colors.system.gray.light,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.light,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  // Size styles
  smallContainer: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  mediumContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  largeContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  // Text styles
  text: {
    ...Typography.body,
    textAlign: 'center',
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: Colors.text.light.primary,
  },
  outlineText: {
    color: Colors.primary.light,
  },
  ghostText: {
    color: Colors.primary.light,
  },
  // Text sizes
  smallText: {
    ...Typography.callout,
  },
  mediumText: {
    ...Typography.body,
  },
  largeText: {
    ...Typography.headline,
  },
  // Disabled state
  disabledContainer: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default Button; 