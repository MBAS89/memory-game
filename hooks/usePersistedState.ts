import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';

// ---------- Ultra-fast, cached persisted state ----------
// Features:
// - In-memory cache: instant value on subsequent screens
// - De-duped reads: one disk read per key
// - Loading flag so UI can show a spinner instead of "hang"
// - Batched set with microtask to avoid thrashing on rapid writes

type StorageType = string | number | boolean | object | null;

const memoryCache = new Map<string, StorageType>();
const inflightReads = new Map<string, Promise<StorageType | null>>();

export const usePersistedState = <T extends StorageType>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>, boolean] => {
  const mounted = useRef(true);
  const [state, setState] = useState<T>(() => {
    if (memoryCache.has(key)) return memoryCache.get(key) as T;
    return initialValue;
  });
  const [loading, setLoading] = useState<boolean>(() => !memoryCache.has(key));

  useEffect(() => {
    mounted.current = true;
    const load = async () => {
      if (memoryCache.has(key)) {
        // already warm
        setLoading(false);
        setState(memoryCache.get(key) as T);
        return;
      }
      let p = inflightReads.get(key);
      if (!p) {
        p = AsyncStorage.getItem(key).then((raw) => (raw !== null ? JSON.parse(raw) : null));
        inflightReads.set(key, p);
      }
      try {
        const value = (await p) as T | null;
        const finalValue = (value === null ? initialValue : value) as T;
        memoryCache.set(key, finalValue);
        if (mounted.current) {
          setState(finalValue);
          setLoading(false);
        }
      } finally {
        inflightReads.delete(key);
      }
    };
    load();
    return () => {
      mounted.current = false;
    };
  }, [initialValue, key]);

  // microtask queue to batch sequential writes
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  const setValue = async (value: T) => {
    memoryCache.set(key, value);
    if (mounted.current) setState(value);
    writeQueue.current = writeQueue.current.then(async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn(`Failed to save ${key} to storage`, e);
      }
    });
    await writeQueue.current;
  };

  return [state, setValue, loading];
};
