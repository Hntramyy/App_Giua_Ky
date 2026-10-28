export const CATEGORIES = [
  'Khai vị',
  'Món chính',
  'Tráng miệng',
  'Đồ uống',
] as const;

export const TABLE_COUNT = 10;

export const VAT_RATE = 0.08;

export const PRICE_STEP = 1000;

export const ORDER_STATUS = {
  SERVING: 'Đang phục vụ',
  PAID: 'Đã thanh toán',
} as const;

export const STORAGE_KEYS = {
  dishes: '@restaurant/dishes',
  orders: '@restaurant/orders',
};
