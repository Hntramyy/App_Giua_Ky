import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export type TabKey = 'tables' | 'menu';

export type RootStackParamList = {
  Main: { tab?: TabKey } | undefined;
  DishForm: { dishId?: string } | undefined;
  Order: { tableNumber: number };
  Checkout: { tableNumber: number };
};

export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AppNavigation = NativeStackNavigationProp<RootStackParamList>;
