import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

interface Props {
  label: string;
  tone: 'primary' | 'success';
}

// Pill with a colored dot, e.g. "● Có khách (1)"
export default function StatChip({ label, tone }: Props) {
  const primary = tone === 'primary';
  return (
    <View
      style={[styles.chip, primary ? styles.chipPrimary : styles.chipSuccess]}
    >
      <View
        style={[styles.dot, primary ? styles.dotPrimary : styles.dotSuccess]}
      />
      <Text
        style={[styles.text, primary ? styles.textPrimary : styles.textSuccess]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  chipPrimary: {
    backgroundColor: colors.primarySoft,
  },
  chipSuccess: {
    backgroundColor: colors.successSoft,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  dotPrimary: {
    backgroundColor: colors.primary,
  },
  dotSuccess: {
    backgroundColor: colors.success,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  textPrimary: {
    color: colors.primaryDark,
  },
  textSuccess: {
    color: colors.successText,
  },
});
