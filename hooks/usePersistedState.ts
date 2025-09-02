import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

type StorageType = string | number | boolean | object | null;

export const usePersistedState = <T extends StorageType>(
    key: string,
    initialValue: T
): [T, (value: T) => Promise<void>] => {
    const [state, setState] = useState<T>(initialValue);

    useEffect(() => {
        const load = async () => {
        try {
            const raw = await AsyncStorage.getItem(key);
            if (raw !== null) {
            setState(JSON.parse(raw));
            }
        } catch (e) {
            console.warn(`Failed to load ${key} from storage`, e);
        }
        };
        load();
    }, [key]);

    const setValue = async (value: T) => {
        try {
            setState(value);
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn(`Failed to save ${key} to storage`, e);
        }
    };

    return [state, setValue];
};