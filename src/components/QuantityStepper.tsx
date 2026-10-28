import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '../theme';
import IconButton from './IconButton';

interface Props {
  quantity: number;
  canIncrease: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantityStepper({
  quantity,
  canIncrease,
  onIncrease,
  onDecrease,
}: Props) {
  return (
    <View style={styles.row}>
      <IconButton
        icon="remove"
        onPress={onDecrease}
        disabled={quantity === 0}
        accessibilityLabel="Giảm số lượng"
      />
      <Text style={[styles.quantity, quantity === 0 && styles.zero]}>
        {quantity}
      </Text>
      <IconButton
        icon="add"
        filled
        onPress={onIncrease}
        disabled={!canIncrease}
        accessibilityLabel="Tăng số lượng"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantity: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  zero: {
    color: colors.disabledText,
  },
});
