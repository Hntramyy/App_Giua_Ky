import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CategoryFilter from '../../components/CategoryFilter';
import DishRow from '../../components/DishRow';
import EmptyState from '../../components/EmptyState';
import AppButton from '../../components/AppButton';
import SectionHeader from '../../components/SectionHeader';
import { TABLE_COUNT } from '../../constants';
import { useRestaurant } from '../../context/RestaurantContext';
import { AppNavigation } from '../../navigation/types';
import { colors, fontSize, radius, shadow, spacing } from '../../theme';
import { Category, Dish } from '../../types';
import { confirmDelete } from '../../utils/confirmDelete';
import { groupDishesByCategory } from '../../utils/menu';
import { countBusyTables, tablesUsingDish } from '../../utils/order';

// Menu grouped by category; tap = edit, long press = delete, switch = sold out
export default function MenuTab() {
  const navigation = useNavigation<AppNavigation>();
  const { dishes, orders, toggleDishAvailable, deleteDish } = useRestaurant();
  const [filter, setFilter] = useState<Category | null>(null);

  const sections = useMemo(
    () =>
      groupDishesByCategory(dishes).filter(
        section => !filter || section.title === filter,
      ),
    [dishes, filter],
  );
  const busyTables = countBusyTables(orders);

  const openAddForm = () => navigation.navigate('DishForm');

  const handleDelete = (dish: Dish) => {
    const tables = tablesUsingDish(orders, dish.id);
    if (tables.length > 0) {
      Alert.alert(
        'Không thể xoá món',
        `"${
          dish.name
        }" đang có trong hoá đơn đang phục vụ của bàn ${tables.join(
          ', ',
        )}. Hãy thanh toán hoặc bỏ món khỏi hoá đơn trước.`,
      );
      return;
    }
    confirmDelete(dish.name, () => deleteDish(dish.id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroBlob} />
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>Tổng quan</Text>
          <Pressable
            onPress={openAddForm}
            accessibilityRole="button"
            hitSlop={6}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
          >
            <Icon name="add" size={14} color={colors.primary} />
            <Text style={styles.addText}>Thêm món</Text>
          </Pressable>
        </View>
        <Text style={styles.heroTitle} numberOfLines={1} adjustsFontSizeToFit>
          <Text style={styles.heroNumber}>{dishes.length}</Text> món ·{' '}
          <Text style={styles.heroNumber}>
            {busyTables}/{TABLE_COUNT}
          </Text>{' '}
          bàn có khách
        </Text>
      </View>

      <CategoryFilter value={filter} onChange={setFilter} />

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} count={section.data.length} />
        )}
        renderItem={({ item }) => (
          <DishRow
            dish={item}
            onPress={() => navigation.navigate('DishForm', { dishId: item.id })}
            onLongPress={() => handleDelete(item)}
            onToggleAvailable={() => toggleDishAvailable(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="no-meals"
            title={
              dishes.length
                ? 'Không có món trong nhóm này'
                : 'Thực đơn đang trống'
            }
            message="Hãy thêm món mới cho nhà hàng."
          >
            <AppButton title="+ Thêm món" onPress={openAddForm} />
          </EmptyState>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    gap: spacing.xs,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    ...shadow,
  },
  heroBlob: {
    position: 'absolute',
    right: -24,
    bottom: -48,
    width: 110,
    height: 110,
    borderRadius: radius.pill,
    backgroundColor: colors.whiteOverlay,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.primarySoft,
  },
  heroTitle: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.white,
  },
  heroNumber: {
    fontSize: fontSize.lg,
    fontWeight: '800',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  addText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
});
