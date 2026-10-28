import { StyleSheet, Text, View } from 'react-native';
import { card, colors, fontSize, radius, spacing } from '../theme';
import { Dish } from '../types';
import { formatPrice } from '../utils/format';
import DishThumb from './DishThumb';
import QuantityStepper from './QuantityStepper';
import SoldOutBadge from './SoldOutBadge';

interface Props {
  dish: Dish;
  quantity: number;
  readOnly?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}

// One dish on the ordering screen; sold-out dishes cannot be added.
// readOnly shows just the ordered quantity (order already confirmed).
export default function OrderDishRow({
  dish,
  quantity,
  readOnly = false,
  onIncrease,
  onDecrease,
}: Props) {
  const selected = quantity > 0;
  return (
    <View style={[styles.card, selected && !readOnly && styles.selected]}>
      <View style={[styles.content, !dish.available && styles.dimmed]}>
        <DishThumb dish={dish} size={48} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {dish.name}
          </Text>
          <Text style={styles.price}>{formatPrice(dish.price)}</Text>
          {!dish.available ? <SoldOutBadge /> : null}
          {selected ? (
            <Text style={styles.lineTotal}>
              = {formatPrice(dish.price * quantity)}
            </Text>
          ) : null}
        </View>
      </View>
      {readOnly ? (
        <View style={styles.qtyBadge}>
          <Text style={styles.qtyText}>×{quantity}</Text>
        </View>
      ) : (
        <QuantityStepper
          quantity={quantity}
          canIncrease={dish.available}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    paddingRight: spacing.md,
    marginBottom: spacing.sm + 2,
    borderWidth: 1.5,
    borderColor: colors.card,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginRight: spacing.sm,
  },
  dimmed: {
    opacity: 0.5,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  price: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  lineTotal: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textMuted,
  },
  qtyBadge: {
    minWidth: 40,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
  },
  qtyText: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.primaryDark,
  },
});
