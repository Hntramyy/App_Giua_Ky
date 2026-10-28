import { SEED_DISHES, createSeedOrders } from '../src/data/seed';
import { CATEGORIES } from '../src/constants';
import { formatDateTime, formatPrice } from '../src/utils/format';
import { groupDishesByCategory, normalizeName } from '../src/utils/menu';
import {
  calcBill,
  countBusyTables,
  suggestCash,
  tablesUsingDish,
} from '../src/utils/order';

test('formatPrice uses dot separators', () => {
  expect(formatPrice(45000)).toBe('45.000 đ');
  expect(formatPrice(1250000)).toBe('1.250.000 đ');
  expect(formatPrice(0)).toBe('0 đ');
});

test('formatDateTime is hh:mm dd/mm/yyyy', () => {
  expect(formatDateTime(new Date(2026, 9, 5, 8, 7))).toBe('08:07 05/10/2026');
});

test('seed has at least 8 dishes covering 4 categories and 1 serving order', () => {
  expect(SEED_DISHES.length).toBeGreaterThanOrEqual(8);
  expect(groupDishesByCategory(SEED_DISHES).map(s => s.title)).toEqual([
    ...CATEGORIES,
  ]);
  expect(countBusyTables(createSeedOrders())).toBe(1);
});

test('bill computes subtotal, VAT 8% and total', () => {
  const [order] = createSeedOrders();
  // 45.000 + 2 x 65.000 + 2 x 25.000 = 225.000
  const bill = calcBill(order, SEED_DISHES);
  expect(bill.subtotal).toBe(225000);
  expect(bill.vat).toBe(18000);
  expect(bill.total).toBe(243000);
});

test('dish used by a serving order is detected', () => {
  const orders = createSeedOrders();
  expect(tablesUsingDish(orders, 'd3')).toEqual([3]);
  expect(tablesUsingDish(orders, 'd2')).toEqual([]);
});

test('name comparison ignores case and extra spaces', () => {
  expect(normalizeName('  Phở   BÒ tái ')).toBe(normalizeName('phở bò tái'));
});

test('cash suggestions are >= total', () => {
  const values = suggestCash(243000);
  expect(values[0]).toBe(243000);
  values.forEach(v => expect(v).toBeGreaterThanOrEqual(243000));
});
