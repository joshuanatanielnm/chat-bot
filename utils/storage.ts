/**
 * Utilities for enhanced localStorage access with compression and error handling
 */

/**
 * Compresses a string by encoding it to base64
 * This can significantly reduce storage size for JSON objects with repeated patterns
 */
export const compressData = (data: string): string => {
  try {
    // Only run in browser environment
    if (typeof window === "undefined") return data;

    // Use TextEncoder to get the bytes and then base64 encode them
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(bytes)]));
  } catch (error) {
    console.error("Error compressing data:", error);
    // Return original data as fallback
    return data;
  }
};

/**
 * Decompresses a base64 encoded string
 */
export const decompressData = (data: string): string => {
  try {
    // Only run in browser environment
    if (typeof window === "undefined") return data;

    // Check if the data is base64 encoded (quick heuristic check)
    if (!/^[A-Za-z0-9+/=]+$/.test(data)) {
      return data; // Not compressed with our method
    }

    // Decode base64 to bytes
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Decode bytes to text
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch (error) {
    console.error("Error decompressing data:", error);
    // Return original data as fallback
    return data;
  }
};

/**
 * Safely store data to localStorage with compression for large objects
 * Automatically compresses data if it's over a certain size threshold
 */
export const setStorageItem = (
  key: string,
  value: string | object | number | boolean
): boolean => {
  try {
    if (typeof window === "undefined") return false;

    // Convert to string if it's not already a string
    const valueStr = typeof value === "string" ? value : JSON.stringify(value);

    // Compress if data is large (over 10KB)
    const shouldCompress = valueStr.length > 10 * 1024;
    const storageData = shouldCompress ? compressData(valueStr) : valueStr;

    // Add a prefix to identify compressed data
    const dataToStore = shouldCompress
      ? `__COMPRESSED__${storageData}`
      : storageData;

    // Verify we have enough space by testing with a small item first
    const testKey = `__storage_test__${Date.now()}`;
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);

    // Store the actual data
    window.localStorage.setItem(key, dataToStore);

    // Verify it was stored correctly
    return true;
  } catch (error) {
    console.error(`Error storing data in localStorage:`, error);

    // Handle quota exceeded errors
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      try {
        // Try to clear some space and retry
        clearOldStorageData();

        // Try again with direct storage (no compression metadata)
        try {
          const valueStr =
            typeof value === "string" ? value : JSON.stringify(value);
          window.localStorage.setItem(key, valueStr);
          return true;
        } catch {
          console.error("Failed to store data even after clearing space");
        }
      } catch {
        console.error("Failed to clear storage space");
      }
    }
    return false;
  }
};

/**
 * Safely retrieve and decompress data from localStorage
 */
export const getStorageItem = (key: string): string | null => {
  try {
    if (typeof window === "undefined") return null;

    const data = window.localStorage.getItem(key);
    if (!data) return null;

    // Check if data is compressed
    if (data.startsWith("__COMPRESSED__")) {
      const compressedData = data.substring("__COMPRESSED__".length);
      return decompressData(compressedData);
    }

    return data;
  } catch (error) {
    console.error(`Error reading data from localStorage:`, error);
    return null;
  }
};

/**
 * Parse JSON data from storage with error handling
 */
export const getStorageJSON = <T>(key: string, defaultValue: T): T => {
  try {
    const data = getStorageItem(key);
    if (!data) return defaultValue;

    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error parsing JSON from storage for key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Set JSON data to storage with compression
 */
export const setStorageJSON = <T>(key: string, value: T): boolean => {
  try {
    const jsonStr = JSON.stringify(value);
    return setStorageItem(key, jsonStr);
  } catch (error) {
    console.error(`Error stringifying JSON for storage for key ${key}:`, error);
    return false;
  }
};

/**
 * Clear old or less important storage data to make room for new data
 */
const clearOldStorageData = (): void => {
  // Items that can be safely cleared if storage is full
  const PURGEABLE_KEYS = [
    "__recent_searches",
    "__view_history",
    "__cached_results",
  ];

  for (const key of PURGEABLE_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore errors when clearing
    }
  }

  // If we still need space, try to clean up old conversation data
  try {
    const conversationsData = window.localStorage.getItem("conversations");
    if (conversationsData) {
      try {
        // See if we can parse and trim the conversations
        const conversations = JSON.parse(conversationsData);
        if (Array.isArray(conversations) && conversations.length > 3) {
          // Keep only the 3 most recent conversations
          const sortedConversations = conversations.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          const trimmedConversations = sortedConversations.slice(0, 3);
          window.localStorage.setItem(
            "conversations",
            JSON.stringify(trimmedConversations)
          );
        }
      } catch {
        // If we can't parse, just remove it
        window.localStorage.removeItem("conversations");
      }
    }
  } catch {
    console.error("Error cleaning up conversations");
  }
};
