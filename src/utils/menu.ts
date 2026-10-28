import { CATEGORIES } from '../constants';
import { Category, Dish } from '../types';

export const CATEGORY_ICONS: Record<Category, string> = {
  'Khai vị': 'tapas',
  'Món chính': 'ramen-dining',
  'Tráng miệng': 'icecream',
  'Đồ uống': 'local-cafe',
};

export interface DishSection {
  title: Category;
  data: Dish[];
}

export function groupDishesByCategory(dishes: Dish[]): DishSection[] {
  return CATEGORIES.map(category => ({
    title: category,
    data: dishes.filter(dish => dish.category === category),
  })).filter(section => section.data.length > 0);
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}
