import { useMemo, useState } from 'react';
import { Alert, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import OrderDishRow from '../components/OrderDishRow';
import SectionHeader from '../components/SectionHeader';
import { useRestaurant } from '../context/RestaurantContext';
import { ScreenProps } from '../navigation/types';
import { card, colors, fontSize, spacing } from '../theme';
import { Dish } from '../types';
import { formatPrice } from '../utils/format';
import { groupDishesByCategory } from '../utils/menu';
import { calcBill, countItems, findServingOrder } from '../utils/order';

export default function OrderScreen({
  navigation,
  route,
}: ScreenProps<'Order'>) {
  const { tableNumber } = route.params;
  const { dishes, orders, changeQuantity } = useRestaurant();

  // A busy table re-opens its serving order to add more dishes
  const order = findServingOrder(orders, tableNumber);
  // Empty table: pick dishes right away. Busy table: view-only until
  // "Gọi thêm món" is pressed.
  const [editing, setEditing] = useState(
    () => !findServingOrder(orders, tableNumber),
  );
  const { subtotal } = calcBill(order, dishes);
  const itemCount = countItems(order);

  const quantityOf = (dishId: string) =>
    order?.items.find(item => item.dishId === dishId)?.quantity ?? 0;

  const sections = useMemo(() => {
    const ordered = new Set(order?.items.map(item => item.dishId));
    return groupDishesByCategory(
      editing ? dishes : dishes.filter(d => ordered.has(d.id)),
    );
  }, [dishes, order, editing]);

  const handleDecrease = (dish: Dish) => {
    if (quantityOf(dish.id) === 1) {
      // Going to 0 removes the dish from the order -> ask first
      Alert.alert(
        'Bỏ món',
        `Bỏ "${dish.name}" khỏi hoá đơn bàn ${tableNumber}?`,
        [
          { text: 'Huỷ', style: 'cancel' },
          {
            text: 'Bỏ món',
            style: 'destructive',
            onPress: () => changeQuantity(tableNumber, dish.id, -1),
          },
        ],
      );
      return;
    }
    changeQuantity(tableNumber, dish.id, -1);
  };

  // Dishes are already saved on every +/−; this just closes the screen.
  // Opening the table again re-opens the same serving order to add more.
  const handleConfirm = () => {
    navigation.popTo('Main', { tab: 'tables' });
    Alert.alert(
      'Đã gọi món',
      `Bàn ${tableNumber}: ${itemCount} món · tạm tính ${formatPrice(
        subtotal,
      )}.\nChạm lại vào bàn để gọi thêm hoặc thanh toán.`,
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.infoCard}>
        <Icon
          name={order ? 'receipt-long' : 'event-seat'}
          size={24}
          color={order ? colors.primary : colors.success}
        />
        <View style={styles.flex}>
          <Text style={styles.infoTitle}>
            Bàn {tableNumber} · {order ? order.status : 'Bàn trống'}
          </Text>
          <Text style={styles.infoSub}>
            {!order
              ? 'Chọn món bên dưới để mở hoá đơn mới'
              : editing
              ? `Mở lúc ${order.createdAt} · đang gọi thêm món`
              : `Mở lúc ${order.createdAt} · món đã gọi`}
          </Text>
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} count={section.data.length} />
        )}
        renderItem={({ item }) => (
          <OrderDishRow
            dish={item}
            quantity={quantityOf(item.id)}
            readOnly={!editing}
            onIncrease={() => changeQuantity(tableNumber, item.id, 1)}
            onDecrease={() => handleDecrease(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="no-meals"
            title="Chưa có món nào trong thực đơn"
            message="Hãy thêm món ở màn hình Thực đơn trước khi gọi món."
          />
        }
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.footerLabel}>Tạm tính · {itemCount} món</Text>
          <Text style={styles.footerTotal}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.actions}>
          {editing ? (
            <AppButton
              title="Xác nhận gọi món"
              icon="check"
              variant="outline"
              disabled={itemCount === 0}
              onPress={handleConfirm}
              style={styles.flex}
            />
          ) : (
            <AppButton
              title="Gọi thêm món"
              icon="add"
              variant="outline"
              onPress={() => setEditing(true)}
              style={styles.flex}
            />
          )}
          <AppButton
            title="Thanh toán"
            icon="payments"
            disabled={itemCount === 0}
            onPress={() => navigation.navigate('Checkout', { tableNumber })}
            style={styles.flex}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  infoCard: {
    ...card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    margin: spacing.lg,
    marginBottom: 0,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  infoSub: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
  footer: {
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  footerLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  footerTotal: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.primary,
  },
});
