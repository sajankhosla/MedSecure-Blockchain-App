/**
 * Spacing system based on Apple's Human Interface Guidelines
 */

// Base unit for our spacing system (8pt grid)
export const baseUnit = 8;

// Spacing scale based on 8pt grid
export const spacing = {
  none: 0,
  xs: baseUnit / 2, // 4
  sm: baseUnit, // 8
  md: baseUnit * 2, // 16
  lg: baseUnit * 3, // 24
  xl: baseUnit * 4, // 32
  '2xl': baseUnit * 5, // 40
  '3xl': baseUnit * 6, // 48
  '4xl': baseUnit * 8, // 64
  '5xl': baseUnit * 10, // 80
};

// Content insets following Apple's guidelines
export const insets = {
  // Standard insets for content
  screen: {
    horizontal: spacing.md,
    vertical: spacing.md,
  },
  
  // Insets for cards and containers
  container: {
    horizontal: spacing.md,
    vertical: spacing.md,
  },
  
  // Insets for forms and inputs
  form: {
    horizontal: spacing.sm,
    vertical: spacing.sm,
  },
};

// Border radius following Apple's guidelines
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Shadows following Apple's guidelines
export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 6.68,
    elevation: 10,
  },
};

export default {
  spacing,
  insets,
  borderRadius,
  shadow,
}; 