import AsyncStorage from '@react-native-async-storage/async-storage';

// Returns null when the key has never been saved (first launch)
export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw != null ? (JSON.parse(raw) as T) : null;
  } catch (e) {
    console.warn(`loadData(${key}) failed`, e);
    return null;
  }
}

export async function saveData<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`saveData(${key}) failed`, e);
  }
}
