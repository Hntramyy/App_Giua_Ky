import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TabItem } from '../navigation/tabs';
import { TabKey } from '../navigation/types';
import { colors, fontSize, radius, shadow, spacing } from '../theme';

interface Props {
  tabs: TabItem[];
  active: TabKey;
  onChange: (key: TabKey) => void;
}

const PADDING = 5;

// Floating pill menu with a sliding highlight behind the active item
export default function BottomTabBar({ tabs, active, onChange }: Props) {
  const insets = useSafeAreaInsets();
  const [innerWidth, setInnerWidth] = useState(0);
  const activeIndex = Math.max(
    0,
    tabs.findIndex(tab => tab.key === active),
  );
  const position = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(position, {
      toValue: activeIndex,
      useNativeDriver: true,
      friction: 9,
      tension: 90,
    }).start();
  }, [activeIndex, position]);

  const segmentWidth = innerWidth / tabs.length;
  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, segmentWidth],
  });

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, spacing.md) },
      ]}
    >
      <View
        style={styles.pill}
        onLayout={e => setInnerWidth(e.nativeEvent.layout.width - PADDING * 2)}
      >
        {innerWidth > 0 ? (
          <Animated.View
            style={[
              styles.indicator,
              { width: segmentWidth, transform: [{ translateX }] },
            ]}
          />
        ) : null}
        {tabs.map(tab => {
          const focused = tab.key === active;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              style={({ pressed }) => [
                styles.item,
                pressed && !focused && styles.pressed,
              ]}
            >
              <Icon
                name={tab.icon}
                size={18}
                color={focused ? colors.white : colors.textMuted}
              />
              <Text
                numberOfLines={1}
                style={[styles.label, focused && styles.labelActive]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
  },
  pill: {
    flexDirection: 'row',
    width: '78%',
    maxWidth: 340,
    padding: PADDING,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    ...shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  indicator: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.white,
    fontWeight: '700',
  },
});
