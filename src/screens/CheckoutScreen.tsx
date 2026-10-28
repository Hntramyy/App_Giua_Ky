import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import SummaryRow from '../components/SummaryRow';
import { VAT_RATE } from '../constants';
import { useRestaurant } from '../context/RestaurantContext';
import { useKeyboardOffset } from '../hooks/useKeyboardOffset';
import { ScreenProps } from '../navigation/types';
import { card, colors, fontSize, radius, spacing } from '../theme';
import { formatPrice, onlyDigits } from '../utils/format';
import { calcBill, findServingOrder, suggestCash } from '../utils/order';

export default function CheckoutScreen({
  navigation,
  route,
}: ScreenProps<'Checkout'>) {
  const { tableNumber } = route.params;
  const { dishes, orders, payOrder } = useRestaurant();
  const keyboardOffset = useKeyboardOffset();
  const [cash, setCash] = useState('');

  const order = findServingOrder(orders, tableNumber);
  const { lines, subtotal, vat, total } = calcBill(order, dishes);

  const cashValue = Number(cash || 0);
  const change = cashValue - total;
  const hasItems = lines.length > 0;
  const enoughCash = cash !== '' && change >= 0;
  const canPay = hasItems && enoughCash;

  const cashError =
    cash !== '' && change < 0
      ? `Khách đưa chưa đủ, còn thiếu ${formatPrice(-change)}`
      : undefined;

  const handlePay = () => {
    if (!order || !canPay) {
      return;
    }
    navigation.popTo('Main', { tab: 'tables' });
    payOrder(order.id);
    Alert.alert(
      'Thanh toán thành công',
      `Bàn ${tableNumber} đã trống.\nTổng cộng: ${formatPrice(
        total,
      )}\nTiền thừa trả khách: ${formatPrice(change)}`,
    );
  };

  if (!order || !hasItems) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['left', 'right', 'bottom']}
      >
        <EmptyState
          icon="receipt-long"
          title="Hoá đơn không có món nào"
          message={`Bàn ${tableNumber} chưa gọi món nên chưa thể thanh toán.`}
        >
          <AppButton
            title="Quay lại gọi món"
            variant="outline"
            onPress={() => navigation.goBack()}
          />
        </EmptyState>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={keyboardOffset}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.billCard}>
            <View style={styles.billHeader}>
              <Text style={styles.billTitle}>Hoá đơn bàn {tableNumber}</Text>
              <Text style={styles.billMeta}>
                {order.status} · {order.createdAt}
              </Text>
            </View>

            <View style={styles.tableHead}>
              <Text style={[styles.headText, styles.colName]}>Món</Text>
              <Text style={[styles.headText, styles.colQty]}>SL</Text>
              <Text style={[styles.headText, styles.colMoney]}>Đơn giá</Text>
              <Text style={[styles.headText, styles.colMoney]}>Thành tiền</Text>
            </View>
            {lines.map(line => (
              <View key={line.dishId} style={styles.lineRow}>
                <Text style={[styles.lineName, styles.colName]}>
                  {line.name}
                </Text>
                <Text style={[styles.lineText, styles.colQty]}>
                  {line.quantity}
                </Text>
                <Text style={[styles.lineText, styles.colMoney]}>
                  {formatPrice(line.unitPrice)}
                </Text>
                <Text style={[styles.lineTotal, styles.colMoney]}>
                  {formatPrice(line.lineTotal)}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />
            <SummaryRow label="Tạm tính" value={formatPrice(subtotal)} />
            <SummaryRow
              label={`VAT ${Math.round(VAT_RATE * 100)}%`}
              value={formatPrice(vat)}
            />
            <View style={styles.divider} />
            <SummaryRow
              label="Tổng cộng"
              value={formatPrice(total)}
              emphasized
            />
          </View>

          <View style={styles.payCard}>
            <FormField
              label="Tiền khách đưa (VNĐ)"
              value={cash}
              onChangeText={text => setCash(onlyDigits(text))}
              placeholder={`Tối thiểu ${formatPrice(total)}`}
              keyboardType="number-pad"
              maxLength={10}
              error={cashError}
              hint={cash ? `= ${formatPrice(cashValue)}` : undefined}
            />
            <View style={styles.suggestRow}>
              {suggestCash(total).map(amount => (
                <Pressable
                  key={amount}
                  onPress={() => setCash(String(amount))}
                  style={({ pressed }) => [
                    styles.suggestChip,
                    pressed && styles.suggestPressed,
                  ]}
                >
                  <Text style={styles.suggestText}>{formatPrice(amount)}</Text>
                </Pressable>
              ))}
            </View>
            <View style={[styles.changeBox, enoughCash && styles.changeBoxOk]}>
              <Text style={styles.changeLabel}>Tiền thừa</Text>
              <Text
                style={[styles.changeValue, enoughCash && styles.changeValueOk]}
              >
                {enoughCash ? formatPrice(change) : '—'}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton
            title={`Xác nhận thanh toán ${formatPrice(total)}`}
            icon="check-circle"
            disabled={!canPay}
            onPress={handlePay}
          />
        </View>
      </KeyboardAvoidingView>
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
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  billCard: {
    ...card,
  },
  billHeader: {
    marginBottom: spacing.md,
  },
  billTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  billMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  tableHead: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  colName: {
    flex: 2.2,
    paddingRight: spacing.xs,
  },
  colQty: {
    flex: 0.6,
    textAlign: 'center',
  },
  colMoney: {
    flex: 1.6,
    textAlign: 'right',
  },
  lineName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  lineText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  lineTotal: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  payCard: {
    ...card,
  },
  suggestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  suggestChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  suggestPressed: {
    backgroundColor: colors.primarySoft,
  },
  suggestText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  changeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  changeBoxOk: {
    backgroundColor: colors.successSoft,
  },
  changeLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  changeValue: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.disabledText,
  },
  changeValueOk: {
    color: colors.success,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
