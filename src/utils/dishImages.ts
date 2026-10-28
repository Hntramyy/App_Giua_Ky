import { ImageSourcePropType } from 'react-native';
import { Dish } from '../types';
import { normalizeName } from './menu';

// Photos bundled with the app (works offline), matched by dish name.
// Dishes added later without a photo fall back to a category icon.
const PHOTOS: [string, ImageSourcePropType][] = [
  ['Gỏi cuốn tôm thịt', require('../assets/dishes/goi-cuon.jpg')],
  ['Chả giò rế', require('../assets/dishes/cha-gio.jpg')],
  ['Phở bò tái', require('../assets/dishes/pho-bo.jpg')],
  ['Cơm tấm sườn bì', require('../assets/dishes/com-tam.jpg')],
  ['Bún chả Hà Nội', require('../assets/dishes/bun-cha.jpg')],
  ['Cá kho tộ', require('../assets/dishes/ca-kho-to.jpg')],
  ['Chè khúc bạch', require('../assets/dishes/che-khuc-bach.jpg')],
  ['Bánh flan', require('../assets/dishes/banh-flan.jpg')],
  ['Trà đá', require('../assets/dishes/tra-da.jpg')],
  ['Cà phê sữa đá', require('../assets/dishes/ca-phe-sua-da.jpg')],
  ['Nước cam ép', require('../assets/dishes/nuoc-cam.jpg')],
];

const IMAGES = new Map(PHOTOS.map(([name, src]) => [normalizeName(name), src]));

export function getDishImage(dish: Dish): ImageSourcePropType | undefined {
  return IMAGES.get(normalizeName(dish.name));
}
