import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fontSize, radius, spacing } from '../theme';

type Variant = 'primary' | 'outline' | 'danger';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const textColor: Record<Variant, string> = {
  primary: colors.white,
  outline: colors.primary,
  danger: colors.white,
};

const textStyle = {
  primary: 'textLight',
  outline: 'textPrimary',
  danger: 'textLight',
} as const;

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  style,
}: Props) {
  const color = disabled ? colors.disabledText : textColor[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={18} color={color} /> : null}
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[
          styles.text,
          disabled ? styles.textDisabled : styles[textStyle[variant]],
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 42,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  text: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  textLight: {
    color: colors.white,
  },
  textPrimary: {
    color: colors.primary,
  },
  textDisabled: {
    color: colors.disabledText,
  },
});
