const kept = new Map();

export const cached = (key) => kept.get(key);

export function remember(key, value) {
    kept.set(key, value);
    return value;
}
