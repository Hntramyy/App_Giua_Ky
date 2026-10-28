import { Image, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, radius } from '../theme';
import { Dish } from '../types';
import { getDishImage } from '../utils/dishImages';
import { CATEGORY_ICONS } from '../utils/menu';

interface Props {
  dish: Dish;
  size: number;
}

// Dish photo, or a category icon when the dish has no photo
export default function DishThumb({ dish, size }: Props) {
  const source = getDishImage(dish);
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      {source ? (
        <Image source={source} style={styles.image} resizeMode="cover" />
      ) : (
        <Icon
          name={CATEGORY_ICONS[dish.category]}
          size={size * 0.45}
          color={colors.primary}
        />
      )}
      {!dish.available ? <View style={styles.overlay} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryTint,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.imageOverlay,
  },
});
