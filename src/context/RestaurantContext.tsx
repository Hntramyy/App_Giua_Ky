import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ORDER_STATUS, STORAGE_KEYS } from '../constants';
import { createSeedOrders, SEED_DISHES } from '../data/seed';
import { loadData, saveData } from '../storage/storage';
import { Dish, DishInput, Order } from '../types';
import { formatDateTime, generateId } from '../utils/format';
import { findServingOrder } from '../utils/order';

interface RestaurantContextValue {
  ready: boolean;
  dishes: Dish[];
  orders: Order[];
  addDish: (input: DishInput) => void;
  updateDish: (id: string, input: DishInput) => void;
  deleteDish: (id: string) => void;
  toggleDishAvailable: (id: string) => void;
  changeQuantity: (tableNumber: number, dishId: string, delta: number) => void;
  payOrder: (orderId: string) => void;
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load from AsyncStorage; seed data on the first launch
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [storedDishes, storedOrders] = await Promise.all([
        loadData<Dish[]>(STORAGE_KEYS.dishes),
        loadData<Order[]>(STORAGE_KEYS.orders),
      ]);
      if (cancelled) {
        return;
      }
      if (storedDishes === null) {
        setDishes(SEED_DISHES);
        setOrders(createSeedOrders());
      } else {
        setDishes(storedDishes);
        setOrders(storedOrders ?? []);
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist every change (only after the initial load finished)
  useEffect(() => {
    if (ready) {
      saveData(STORAGE_KEYS.dishes, dishes);
    }
  }, [ready, dishes]);

  useEffect(() => {
    if (ready) {
      saveData(STORAGE_KEYS.orders, orders);
    }
  }, [ready, orders]);

  const addDish = useCallback((input: DishInput) => {
    setDishes(prev => [...prev, { ...input, id: generateId() }]);
  }, []);

  const updateDish = useCallback((id: string, input: DishInput) => {
    setDishes(prev => prev.map(d => (d.id === id ? { ...input, id } : d)));
  }, []);

  const deleteDish = useCallback((id: string) => {
    setDishes(prev => prev.filter(d => d.id !== id));
  }, []);

  const toggleDishAvailable = useCallback((id: string) => {
    setDishes(prev =>
      prev.map(d => (d.id === id ? { ...d, available: !d.available } : d)),
    );
  }, []);

  // Each table has at most one serving order: reuse it, or create one on the first dish
  const changeQuantity = useCallback(
    (tableNumber: number, dishId: string, delta: number) => {
      setOrders(prev => {
        const current = findServingOrder(prev, tableNumber);
        if (!current) {
          if (delta <= 0) {
            return prev;
          }
          const newOrder: Order = {
            id: generateId(),
            tableNumber,
            items: [{ dishId, quantity: delta }],
            status: ORDER_STATUS.SERVING,
            createdAt: formatDateTime(new Date()),
          };
          return [...prev, newOrder];
        }

        const exists = current.items.some(item => item.dishId === dishId);
        const items = (
          exists
            ? current.items.map(item =>
                item.dishId === dishId
                  ? { ...item, quantity: item.quantity + delta }
                  : item,
              )
            : delta > 0
            ? [...current.items, { dishId, quantity: delta }]
            : current.items
        ).filter(item => item.quantity > 0);

        // No dish left: close the empty order so the table is free again
        if (items.length === 0) {
          return prev.filter(order => order.id !== current.id);
        }
        return prev.map(order =>
          order.id === current.id ? { ...order, items } : order,
        );
      });
    },
    [],
  );

  const payOrder = useCallback((orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: ORDER_STATUS.PAID } : order,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      ready,
      dishes,
      orders,
      addDish,
      updateDish,
      deleteDish,
      toggleDishAvailable,
      changeQuantity,
      payOrder,
    }),
    [
      ready,
      dishes,
      orders,
      addDish,
      updateDish,
      deleteDish,
      toggleDishAvailable,
      changeQuantity,
      payOrder,
    ],
  );

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant(): RestaurantContextValue {
  const ctx = useContext(RestaurantContext);
  if (!ctx) {
    throw new Error('useRestaurant must be used inside RestaurantProvider');
  }
  return ctx;
}
