import { ORDER_STATUS, VAT_RATE } from '../constants';
import { Dish, Order } from '../types';

export function getServingOrders(orders: Order[]): Order[] {
  return orders.filter(order => order.status === ORDER_STATUS.SERVING);
}

export function findServingOrder(
  orders: Order[],
  tableNumber: number,
): Order | undefined {
  return getServingOrders(orders).find(o => o.tableNumber === tableNumber);
}

export function countBusyTables(orders: Order[]): number {
  return new Set(getServingOrders(orders).map(o => o.tableNumber)).size;
}

// Tables whose serving order contains the dish
export function tablesUsingDish(orders: Order[], dishId: string): number[] {
  return getServingOrders(orders)
    .filter(order => order.items.some(item => item.dishId === dishId))
    .map(order => order.tableNumber)
    .sort((a, b) => a - b);
}

export function countItems(order?: Order): number {
  return order ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
}

export interface BillLine {
  dishId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Bill {
  lines: BillLine[];
  subtotal: number;
  vat: number;
  total: number;
}

export function calcBill(order: Order | undefined, dishes: Dish[]): Bill {
  const lines: BillLine[] = (order?.items ?? []).map(item => {
    const dish = dishes.find(d => d.id === item.dishId);
    const unitPrice = dish?.price ?? 0;
    return {
      dishId: item.dishId,
      name: dish?.name ?? '(Món đã bị xoá)',
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const vat = Math.round(subtotal * VAT_RATE);
  return { lines, subtotal, vat, total: subtotal + vat };
}

// Quick cash amounts suggested on the checkout screen
export function suggestCash(total: number): number[] {
  if (total <= 0) {
    return [];
  }
  const steps = [10000, 50000, 100000, 500000];
  const values = [total, ...steps.map(step => Math.ceil(total / step) * step)];
  return Array.from(new Set(values))
    .sort((a, b) => a - b)
    .slice(0, 4);
}
