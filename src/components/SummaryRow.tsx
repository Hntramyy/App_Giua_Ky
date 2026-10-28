import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '../theme';

interface Props {
  label: string;
  value: string;
  emphasized?: boolean;
}

export default function SummaryRow({
  label,
  value,
  emphasized = false,
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, emphasized && styles.labelStrong]}>
        {label}
      </Text>
      <Text style={[styles.value, emphasized && styles.valueStrong]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  value: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  labelStrong: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  valueStrong: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.primary,
  },
});
