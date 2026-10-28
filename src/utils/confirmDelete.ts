import { Alert } from 'react-native';

// Every delete action must ask for confirmation via Alert (exam requirement)
export function confirmDelete(itemName: string, onConfirm: () => void) {
  Alert.alert('Xác nhận xoá', `Bạn có chắc muốn xoá "${itemName}"?`, [
    { text: 'Huỷ', style: 'cancel' },
    { text: 'Xoá', style: 'destructive', onPress: onConfirm },
  ]);
}
