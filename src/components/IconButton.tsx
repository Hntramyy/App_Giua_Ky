import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, radius } from '../theme';

interface Props {
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  filled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export default function IconButton({
  icon,
  onPress,
  disabled = false,
  color = colors.primary,
  filled = false,
  accessibilityLabel,
  style,
}: Props) {
  const iconColor = disabled
    ? colors.disabledText
    : filled
    ? colors.white
    : color;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        filled ? styles.filled : styles.outline,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Icon name={icon} size={18} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  outline: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  filled: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.92 }],
  },
  disabled: {
    borderColor: colors.disabled,
    backgroundColor: colors.background,
  },
});
