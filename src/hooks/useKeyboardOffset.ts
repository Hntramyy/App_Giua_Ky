import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Height of the native-stack header, so KeyboardAvoidingView lifts content correctly
export function useKeyboardOffset(): number {
  const insets = useSafeAreaInsets();
  return insets.top + (Platform.OS === 'ios' ? 44 : 56);
}
