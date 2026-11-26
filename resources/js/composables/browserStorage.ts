/**
 * The browser's local or session storage, which a private window or a blocked site may refuse. This is the one place
 * that absorbs such a refusal: a refused read answers null, a refused write keeps the value for this visit only, and
 * both say so in the console.
 */
export type StorageArea = 'local' | 'session';

function storageOf(area: StorageArea): Storage {
    return area === 'local' ? window.localStorage : window.sessionStorage;
}

/**
 * The text stored under the key, or null when nothing is stored or the browser refuses the read.
 */
export function readStored(area: StorageArea, key: string): string | null {
    try {
        return storageOf(area).getItem(key);
    } catch (error) {
        console.warn(`The browser refused to read ${key} from its ${area} storage.`, error);

        return null;
    }
}

/**
 * The JSON value stored under the key as the parser reads it, or null when nothing is stored, the browser refuses
 * the read, the stored text is not JSON, or the parser finds no value of its kind in it.
 */
export function readStoredJson<T>(area: StorageArea, key: string, parse: (decoded: unknown) => T | null): T | null {
    const stored = readStored(area, key);

    if (stored === null) {
        return null;
    }

    let decoded: unknown;

    try {
        decoded = JSON.parse(stored);
    } catch (error) {
        console.warn(`The ${area} storage holds no JSON under ${key}.`, error);

        return null;
    }

    return parse(decoded);
}

/**
 * Stores the value as JSON under the key; a refused write leaves the value in memory for this visit.
 */
export function keepStoredJson(area: StorageArea, key: string, value: unknown): void {
    keepStored(area, key, JSON.stringify(value));
}

/**
 * Stores the text under the key; a refused write leaves the value in memory for this visit.
 */
export function keepStored(area: StorageArea, key: string, value: string): void {
    try {
        storageOf(area).setItem(key, value);
    } catch (error) {
        console.warn(`The browser refused to keep ${key} in its ${area} storage.`, error);
    }
}

/**
 * Removes what is stored under the key; a refused removal is logged in the console.
 */
export function forgetStored(area: StorageArea, key: string): void {
    try {
        storageOf(area).removeItem(key);
    } catch (error) {
        console.warn(`The browser refused to remove ${key} from its ${area} storage.`, error);
    }
}

/**
 * Whether the browser lets this page keep values in the storage area, so a caller can say when they last only as
 * long as the page stays open.
 */
export function isStorageAvailable(area: StorageArea): boolean {
    const probe = 'journal.storage-probe';

    try {
        storageOf(area).setItem(probe, probe);
        storageOf(area).removeItem(probe);

        return true;
    } catch {
        return false;
    }
}
