import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { CATEGORIES } from '../constants';
import { colors, fontSize, radius, spacing } from '../theme';
import { Category } from '../types';

interface Props {
  value: Category | null;
  onChange: (category: Category | null) => void;
}

const OPTIONS: (Category | null)[] = [null, ...CATEGORIES];

// Pill chips: "Tất cả" + the 4 dish groups
export default function CategoryFilter({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      {OPTIONS.map(option => {
        const selected = option === value;
        return (
          <Pressable
            key={option ?? 'all'}
            onPress={() => onChange(option)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipActive,
              pressed && !selected && styles.chipPressed,
            ]}
          >
            <Text style={[styles.text, selected && styles.textActive]}>
              {option ?? 'Tất cả'}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  row: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipPressed: {
    backgroundColor: colors.primaryTint,
  },
  text: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
  },
  textActive: {
    color: colors.white,
    fontWeight: '700',
  },
});
