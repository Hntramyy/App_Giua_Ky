import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckoutScreen from '../screens/CheckoutScreen';
import DishFormScreen from '../screens/DishFormScreen';
import MainScreen from '../screens/MainScreen';
import OrderScreen from '../screens/OrderScreen';
import { colors, fontSize } from '../theme';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: fontSize.lg,
          color: colors.text,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DishForm"
        component={DishFormScreen}
        options={({ route }) => ({
          title: route.params?.dishId ? 'Sửa món' : 'Thêm món',
        })}
      />
      <Stack.Screen
        name="Order"
        component={OrderScreen}
        options={({ route }) => ({
          title: `Gọi món · Bàn ${route.params.tableNumber}`,
        })}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={({ route }) => ({
          title: `Thanh toán · Bàn ${route.params.tableNumber}`,
        })}
      />
    </Stack.Navigator>
  );
}
