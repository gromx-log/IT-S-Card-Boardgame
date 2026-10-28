// Safe storage wrapper with in-memory fallback for private browsing or disabled storage

type StorageType = "local" | "session";

const memoryStore: Record<StorageType, Map<string, string>> = {
  local: new Map<string, string>(),
  session: new Map<string, string>(),
};

function getStorageInstance(type: StorageType): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const storage = type === "local" ? window.localStorage : window.sessionStorage;
    const testKey = "__itscard_test__";
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

export const safeStorage = {
  get(type: StorageType, key: string): string | null {
    try {
      const storage = getStorageInstance(type);
      if (storage) {
        return storage.getItem(key);
      }
    } catch {
      // Fall through to memory
    }
    return memoryStore[type].get(key) ?? null;
  },

  set(type: StorageType, key: string, value: string): void {
    try {
      const storage = getStorageInstance(type);
      if (storage) {
        storage.setItem(key, value);
        return;
      }
    } catch {
      // Fall through to memory
    }
    memoryStore[type].set(key, value);
  },

  remove(type: StorageType, key: string): void {
    try {
      const storage = getStorageInstance(type);
      if (storage) {
        storage.removeItem(key);
        return;
      }
    } catch {
      // Fall through to memory
    }
    memoryStore[type].delete(key);
  },

  getJSON<T>(type: StorageType, key: string): T | null {
    const raw = this.get(type, key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setJSON<T>(type: StorageType, key: string, value: T): void {
    try {
      const json = JSON.stringify(value);
      this.set(type, key, json);
    } catch (err) {
      console.warn(`Failed to serialize JSON for key ${key}:`, err);
    }
  },
};

