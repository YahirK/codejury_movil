// Theme colors based on CodeJury mockups
export const colors = {
  // Primary colors
  primary: '#14B8A6',
  primaryDark: '#0D9488',
  primaryLight: '#5EEAD4',
  
  // Background colors
  background: '#F8FAFA',
  backgroundDark: '#0F172A',
  surface: '#FFFFFF',
  surfaceDark: '#1E293B',
  
  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textPrimaryDark: '#F8FAFC',
  textSecondaryDark: '#94A3B8',
  
  // Status colors
  pending: '#F59E0B',
  pendingBg: '#FEF3C7',
  inProgress: '#3B82F6',
  inProgressBg: '#DBEAFE',
  completed: '#10B981',
  completedBg: '#D1FAE5',
  inReview: '#F97316',
  inReviewBg: '#FFEDD5',
  
  // Input colors
  inputBorder: '#E5E7EB',
  inputBackground: '#FFFFFF',
  placeholder: '#9CA3AF',
  
  // Others
  error: '#EF4444',
  errorBg: '#FEE2E2',
  warning: '#F59E0B',
  warningBg: '#FEF9C3',
  success: '#10B981',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
};
