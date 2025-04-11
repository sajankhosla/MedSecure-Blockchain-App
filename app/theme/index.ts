/**
 * Theme index file that exports all theme-related elements
 */

import { Colors, getColors, ColorScheme } from './colors';
import Typography from './typography';
import SpacingSystem from './spacing';

// Export theme elements
export { Colors, getColors, Typography, SpacingSystem };
export type { ColorScheme };

// Create a unified theme object
export const createTheme = (colorScheme: ColorScheme) => {
  return {
    colors: getColors(colorScheme),
    typography: Typography,
    ...SpacingSystem,
  };
};

// Default theme
export default createTheme('light'); 