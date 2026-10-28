import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fontSize, radius, shadow, spacing } from '../theme';
import { formatPrice } from '../utils/format';

interface Props {
  tableNumber: number;
  busy: boolean;
  itemCount: number;
  subtotal: number;
  width: number;
  onPress: () => void;
}

// Compact table tile for the 3-column grid
export default function TableCard({
  tableNumber,
  busy,
  itemCount,
  subtotal,
  width,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Bàn ${tableNumber}, ${busy ? 'có khách' : 'trống'}`}
      style={({ pressed }) => [
        styles.tile,
        { width },
        busy ? styles.tileBusy : styles.tileFree,
        pressed && styles.pressed,
      ]}
    >
      {busy ? <View style={styles.blob} /> : null}
      <View style={[styles.dot, busy ? styles.dotBusy : styles.dotFree]} />

      <View style={[styles.iconCircle, busy && styles.iconCircleBusy]}>
        <Icon
          name={busy ? 'room-service' : 'table-restaurant'}
          size={18}
          color={busy ? colors.white : colors.primary}
        />
      </View>

      <Text style={[styles.name, busy && styles.textOnBusy]}>
        Bàn {tableNumber}
      </Text>

      {busy ? (
        <>
          <Text style={styles.metaBusy} numberOfLines={1}>
            {itemCount} món
          </Text>
          <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
            {formatPrice(subtotal)}
          </Text>
        </>
      ) : (
        <Text style={styles.metaFree}>Trống</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    minHeight: 98,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow,
  },
  tileFree: {
    backgroundColor: colors.card,
  },
  tileBusy: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  blob: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: 70,
    height: 70,
    borderRadius: radius.pill,
    backgroundColor: colors.whiteOverlay,
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  dotFree: {
    backgroundColor: colors.success,
  },
  dotBusy: {
    backgroundColor: colors.white,
  },
  iconCircle: {
    width: 32,
    height: 32,
    marginBottom: spacing.xs,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryTint,
  },
  iconCircleBusy: {
    backgroundColor: colors.whiteOverlay,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  textOnBusy: {
    color: colors.white,
  },
  metaFree: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.success,
  },
  metaBusy: {
    fontSize: fontSize.xs,
    color: colors.primarySoft,
  },
  amount: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: colors.white,
  },
});
