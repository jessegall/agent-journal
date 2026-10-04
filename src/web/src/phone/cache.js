const kept = new Map();

export const cached = (key) => kept.get(key);

export function cache(key, value) {
    kept.set(key, value);
    return value;
}
