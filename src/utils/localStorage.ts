const isBrowser = typeof window !== 'undefined';

export const localStorageUtil = {
    get<T = string>(key: string): T | null {
        if (!isBrowser) return null;

        try {
            const value = localStorage.getItem(key);
            if (value === null) return null;

            // Try to parse JSON if possible
            try {
                return JSON.parse(value) as T;
            } catch {
                return value as unknown as T;
            }
        } catch (error) {
            console.error(`Error getting localStorage key "${key}":`, error);
            return null;
        }
    },

    set<T = string>(key: string, value: T): void {
        if (!isBrowser) return;

        try {
            const val = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, val);
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    },

    remove(key: string): void {
        if (!isBrowser) return;

        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    },
};
