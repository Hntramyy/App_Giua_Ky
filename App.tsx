/**
 * Restaurant management app
 *
 * @format
 */

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {
  RestaurantProvider,
  useRestaurant,
} from './src/context/RestaurantContext';
import { colors, fontSize, spacing } from './src/theme';

function AppContent() {
  const { ready } = useRestaurant();

  // Wait for AsyncStorage before showing any screen
  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <RestaurantProvider>
        <AppContent />
      </RestaurantProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});

export default App;
