import { colors } from './colors';

export { colors };

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
};

export const shadow = {
  shadowColor: colors.shadow,
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
};

// Base style for every list row / panel shown as a card
export const card = {
  backgroundColor: colors.card,
  borderRadius: radius.lg,
  padding: spacing.md,
  ...shadow,
};

// Square rounded tile holding an icon
export const iconTile = {
  width: 34,
  height: 34,
  borderRadius: radius.md,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  backgroundColor: colors.surfaceMuted,
};
