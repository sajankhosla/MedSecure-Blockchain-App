/**
 * App color palette based on Apple's Human Interface Guidelines
 */

export const Colors = {
  // Primary colors
  primary: {
    light: '#007AFF', // iOS blue
    dark: '#0A84FF',
  },
  // Background colors
  background: {
    light: '#FFFFFF',
    dark: '#000000',
  },
  // Surface colors
  surface: {
    light: '#F2F2F7',
    dark: '#1C1C1E',
  },
  // Text colors
  text: {
    light: {
      primary: '#000000',
      secondary: '#3C3C43',
      tertiary: '#87878C',
    },
    dark: {
      primary: '#FFFFFF',
      secondary: '#EBEBF5',
      tertiary: '#8E8E93',
    }
  },
  // System colors (following iOS guidelines)
  system: {
    red: {
      light: '#FF3B30',
      dark: '#FF453A',
    },
    green: {
      light: '#34C759',
      dark: '#30D158',
    },
    orange: {
      light: '#FF9500',
      dark: '#FF9F0A',
    },
    yellow: {
      light: '#FFCC00',
      dark: '#FFD60A',
    },
    gray: {
      light: '#8E8E93',
      dark: '#8E8E93',
    }
  },
  // Semantic colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
};

export type ColorScheme = 'light' | 'dark';

export const getColors = (colorScheme: ColorScheme) => {
  return {
    primary: Colors.primary[colorScheme],
    background: Colors.background[colorScheme],
    surface: Colors.surface[colorScheme],
    text: Colors.text[colorScheme],
    system: {
      red: Colors.system.red[colorScheme],
      green: Colors.system.green[colorScheme],
      orange: Colors.system.orange[colorScheme],
      yellow: Colors.system.yellow[colorScheme],
      gray: Colors.system.gray[colorScheme],
    },
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    info: Colors.info,
  };
}; 