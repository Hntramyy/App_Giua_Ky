import { CATEGORIES, ORDER_STATUS } from './constants';

export type Category = (typeof CATEGORIES)[number];

export interface Dish {
  id: string;
  name: string;
  category: Category;
  price: number;
  available: boolean;
}

export type DishInput = Omit<Dish, 'id'>;

export interface OrderItem {
  dishId: string;
  quantity: number;
}

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string; // hh:mm dd/mm/yyyy
}
