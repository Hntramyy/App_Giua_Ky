import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import StatChip from '../../components/StatChip';
import TableCard from '../../components/TableCard';
import { TABLE_COUNT } from '../../constants';
import { useRestaurant } from '../../context/RestaurantContext';
import { AppNavigation } from '../../navigation/types';
import { card, colors, fontSize, spacing } from '../../theme';
import { formatPrice } from '../../utils/format';
import { calcBill, countItems, findServingOrder } from '../../utils/order';

const TABLES = Array.from({ length: TABLE_COUNT }, (_, i) => i + 1);
const COLUMNS = 3;
const GAP = spacing.md - 2;

// Table map: 10 tables in a 3-column grid, busy tables highlighted
export default function TablesTab() {
  const navigation = useNavigation<AppNavigation>();
  const { orders, dishes } = useRestaurant();
  const { width } = useWindowDimensions();
  const tileWidth = (width - spacing.lg * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  const tableInfo = useMemo(
    () =>
      TABLES.map(tableNumber => {
        const order = findServingOrder(orders, tableNumber);
        return {
          tableNumber,
          busy: !!order,
          itemCount: countItems(order),
          subtotal: calcBill(order, dishes).subtotal,
        };
      }),
    [orders, dishes],
  );
  const busyTables = tableInfo.filter(t => t.busy);
  const openAmount = busyTables.reduce((sum, t) => sum + t.subtotal, 0);

  return (
    <FlatList
      data={tableInfo}
      keyExtractor={item => String(item.tableNumber)}
      numColumns={COLUMNS}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View style={styles.summary}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>Đang phục vụ</Text>
              <Text style={styles.summaryValue}>
                {busyTables.length}
                <Text style={styles.summaryTotal}>/{TABLE_COUNT} bàn</Text>
              </Text>
            </View>
            <View style={styles.alignEnd}>
              <Text style={styles.summaryLabel}>Tạm tính chưa thu</Text>
              <Text style={styles.summaryAmount}>
                {formatPrice(openAmount)}
              </Text>
            </View>
          </View>
          <View style={styles.chips}>
            <StatChip
              tone="primary"
              label={`Có khách (${busyTables.length})`}
            />
            <StatChip
              tone="success"
              label={`Trống (${TABLE_COUNT - busyTables.length})`}
            />
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <TableCard
          {...item}
          width={tileWidth}
          onPress={() =>
            navigation.navigate('Order', { tableNumber: item.tableNumber })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: GAP,
  },
  row: {
    gap: GAP,
  },
  summary: {
    ...card,
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  summaryLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  summaryValue: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
  },
  summaryTotal: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
  summaryAmount: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.primary,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
