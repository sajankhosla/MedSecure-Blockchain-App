/**
 * Typography styles based on Apple's Human Interface Guidelines
 */

import { Platform, TextStyle } from 'react-native';

// Base font family
const fontFamily = Platform.OS === 'ios' ? undefined : 'System';

// Font weights
export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

const fontWeights: Record<FontWeight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Font sizes following Apple's guidelines
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Line heights (calculated based on iOS guidelines for optimal readability)
export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 22,
  lg: 24,
  xl: 26,
  '2xl': 32,
  '3xl': 38,
  '4xl': 44,
  '5xl': 56,
};

// Typography variants
export const createTextStyle = (
  size: keyof typeof fontSize,
  weight: FontWeight = 'regular',
  additionalStyles: Partial<TextStyle> = {}
): TextStyle => {
  return {
    fontFamily,
    fontSize: fontSize[size],
    lineHeight: lineHeight[size],
    fontWeight: fontWeights[weight],
    ...additionalStyles,
  };
};

// Predefined text styles based on Apple's Human Interface Guidelines
export const Typography = {
  // Display styles
  largeTitle: createTextStyle('5xl', 'bold', { letterSpacing: 0.41 }),
  title1: createTextStyle('4xl', 'bold', { letterSpacing: 0.34 }),
  title2: createTextStyle('3xl', 'bold', { letterSpacing: 0.29 }),
  title3: createTextStyle('2xl', 'semibold', { letterSpacing: 0.26 }),
  
  // Body styles
  headline: createTextStyle('lg', 'semibold', { letterSpacing: -0.41 }),
  body: createTextStyle('md', 'regular', { letterSpacing: -0.32 }),
  callout: createTextStyle('sm', 'regular', { letterSpacing: -0.24 }),
  subheadline: createTextStyle('sm', 'regular', { letterSpacing: -0.24 }),
  footnote: createTextStyle('xs', 'regular', { letterSpacing: -0.08 }),
  caption1: createTextStyle('xs', 'regular', { letterSpacing: 0 }),
  caption2: createTextStyle('xs', 'medium', { letterSpacing: 0.07 }),
};

// Export for usage
export default Typography; 