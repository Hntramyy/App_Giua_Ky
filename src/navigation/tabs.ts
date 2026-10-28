import { TabKey } from './types';

export interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
}

// Bottom menu, built by hand (bottom-tabs library is not in the allowed list)
export const TABS: TabItem[] = [
  { key: 'tables', label: 'Sơ đồ bàn', icon: 'table-restaurant' },
  { key: 'menu', label: 'Thực đơn', icon: 'restaurant-menu' },
];
