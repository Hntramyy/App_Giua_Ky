import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import CategoryPicker from '../components/CategoryPicker';
import FormField from '../components/FormField';
import { CATEGORIES, PRICE_STEP } from '../constants';
import { useRestaurant } from '../context/RestaurantContext';
import { useKeyboardOffset } from '../hooks/useKeyboardOffset';
import { ScreenProps } from '../navigation/types';
import { card, colors, fontSize, spacing } from '../theme';
import { Category } from '../types';
import { formatPrice, onlyDigits } from '../utils/format';
import { normalizeName } from '../utils/menu';

interface FormErrors {
  name?: string;
  price?: string;
}

// Same form for adding and editing; editing pre-fills the old values
export default function DishFormScreen({
  navigation,
  route,
}: ScreenProps<'DishForm'>) {
  const { dishes, addDish, updateDish } = useRestaurant();
  const keyboardOffset = useKeyboardOffset();
  const dishId = route.params?.dishId;
  const editingDish = dishId ? dishes.find(d => d.id === dishId) : undefined;

  const [name, setName] = useState(editingDish?.name ?? '');
  const [price, setPrice] = useState(
    editingDish ? String(editingDish.price) : '',
  );
  const [category, setCategory] = useState<Category>(
    editingDish?.category ?? CATEGORIES[0],
  );
  const [available, setAvailable] = useState(editingDish?.available ?? true);
  const [touched, setTouched] = useState({ name: false, price: false });
  const [submitted, setSubmitted] = useState(false);

  // The dish being edited no longer exists
  useEffect(() => {
    if (dishId && !editingDish) {
      navigation.goBack();
    }
  }, [dishId, editingDish, navigation]);

  const errors = useMemo<FormErrors>(() => {
    const result: FormErrors = {};
    const normalized = normalizeName(name);
    if (!normalized) {
      result.name = 'Tên món không được để trống';
    } else if (
      dishes.some(d => d.id !== dishId && normalizeName(d.name) === normalized)
    ) {
      result.name = 'Tên món đã tồn tại, vui lòng chọn tên khác';
    }

    const value = Number(price);
    if (!price) {
      result.price = 'Vui lòng nhập giá bán';
    } else if (!Number.isInteger(value) || value <= 0) {
      result.price = 'Giá phải là số lớn hơn 0';
    } else if (value % PRICE_STEP !== 0) {
      result.price = 'Giá phải chia hết cho 1.000 (VD: 45000)';
    }
    return result;
  }, [name, price, dishes, dishId]);

  const showNameError = (touched.name || submitted) && errors.name;
  const showPriceError = (touched.price || submitted) && errors.price;

  const handleSave = () => {
    setSubmitted(true);
    if (errors.name || errors.price) {
      return;
    }
    const input = {
      name: name.trim().replace(/\s+/g, ' '),
      category,
      price: Number(price),
      available,
    };
    if (editingDish) {
      updateDish(editingDish.id, input);
    } else {
      addDish(input);
    }
    navigation.goBack();
  };

  const priceHint =
    price && !errors.price
      ? `Hiển thị: ${formatPrice(Number(price))}`
      : 'Đơn vị: VNĐ';

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={keyboardOffset}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            <FormField
              label="Tên món *"
              value={name}
              onChangeText={setName}
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
              placeholder="VD: Phở bò tái"
              autoCapitalize="sentences"
              returnKeyType="next"
              error={showNameError || undefined}
            />
            <FormField
              label="Giá bán (VNĐ) *"
              value={price}
              onChangeText={text => setPrice(onlyDigits(text))}
              onBlur={() => setTouched(t => ({ ...t, price: true }))}
              placeholder="VD: 45000"
              keyboardType="number-pad"
              maxLength={9}
              error={showPriceError || undefined}
              hint={priceHint}
            />
            <CategoryPicker value={category} onChange={setCategory} />
            <View style={styles.switchRow}>
              <View style={styles.flex}>
                <Text style={styles.switchTitle}>Còn phục vụ</Text>
                <Text style={styles.switchHint}>
                  Tắt nếu món tạm thời đã hết
                </Text>
              </View>
              <Switch
                value={available}
                onValueChange={setAvailable}
                trackColor={{
                  false: colors.disabled,
                  true: colors.successSoft,
                }}
                thumbColor={available ? colors.success : colors.white}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton
            title="Huỷ"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.flex}
          />
          <AppButton
            title={editingDish ? 'Lưu thay đổi' : 'Thêm món'}
            icon="check"
            onPress={handleSave}
            style={styles.flex}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  formCard: {
    ...card,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  switchTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  switchHint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
