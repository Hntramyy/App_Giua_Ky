import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { card, colors, fontSize, spacing } from '../theme';
import { Dish } from '../types';
import { formatPrice } from '../utils/format';
import DishThumb from './DishThumb';
import SoldOutBadge from './SoldOutBadge';

interface Props {
  dish: Dish;
  onPress: () => void;
  onLongPress: () => void;
  onToggleAvailable: () => void;
}

// One dish in the menu list: tap = edit, long press = delete, switch = sold out
export default function DishRow({
  dish,
  onPress,
  onLongPress,
  onToggleAvailable,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.content, !dish.available && styles.dimmed]}>
        <DishThumb dish={dish} size={54} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {dish.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(dish.price)}</Text>
            {!dish.available ? <SoldOutBadge /> : null}
          </View>
        </View>
      </View>
      <Switch
        value={dish.available}
        onValueChange={onToggleAvailable}
        trackColor={{ false: colors.disabled, true: colors.successSoft }}
        thumbColor={dish.available ? colors.success : colors.white}
      />
    </Pressable>
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
  },
  pressed: {
    backgroundColor: colors.primaryTint,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dimmed: {
    opacity: 0.5,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  price: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.primary,
  },
});
