/**
 * LocalStorage helpers: safe JSON encode/decode with key namespacing.
 */

const KEY_PREFIX = "sqlmaster:";

// PUBLIC_INTERFACE
export function storageKey(key) {
  /** Build a namespaced key for SQLMaster data. */
  return `${KEY_PREFIX}${key}`;
}

function safeJsonParse(value, fallback) {
  try {
    if (value === null || value === undefined) return fallback;
    return JSON.parse(value);
  } catch (_e) {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function loadJson(key, fallback) {
  /** Load a JSON value from localStorage; returns fallback if missing/invalid. */
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    return safeJsonParse(raw, fallback);
  } catch (_e) {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function saveJson(key, value) {
  /** Save a JSON value to localStorage (best-effort). */
  try {
    window.localStorage.setItem(storageKey(key), JSON.stringify(value));
  } catch (_e) {
    // Ignore quota and privacy errors; app still works with in-memory state.
  }
}

// PUBLIC_INTERFACE
export function remove(key) {
  /** Remove a SQLMaster localStorage key (best-effort). */
  try {
    window.localStorage.removeItem(storageKey(key));
  } catch (_e) {
    // no-op
  }
}
