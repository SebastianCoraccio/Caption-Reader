import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Find way to type listeners
type ListenerHandler = (value: any) => void;
type StorageKey = 'recents' | 'settings';

const listeners: Record<StorageKey, ListenerHandler[]> = {
  recents: [],
  settings: [],
};

export const addListener = async (
  key: StorageKey,
  handler: ListenerHandler,
) => {
  listeners[key].push(handler);
};

export const removeListener = async (
  key: StorageKey,
  handler: ListenerHandler,
) => {
  listeners[key].filter(h => h !== handler);
};

export const storeData = async (key: StorageKey, value: object) => {
  const keyListeners = listeners[key];
  keyListeners.forEach(handler => handler(value));

  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export async function getData<T>(key: StorageKey): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return null;
    // error reading value
  }
}
