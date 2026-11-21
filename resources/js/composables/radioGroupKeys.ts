/**
 * The keys of a radio group: an arrow moves the choice to the next or the previous option, round the ends, and Home
 * and End move it to the first and the last. It answers the value the key chooses, or null for any other key.
 */
export function radioGroupChoice<TValue>(
    key: string,
    values: readonly TValue[],
    current: TValue | null,
): TValue | null {
    if (values.length === 0) {
        return null;
    }

    const at = current === null ? -1 : values.indexOf(current);

    if (key === 'ArrowRight' || key === 'ArrowDown') {
        return values[(at + 1) % values.length];
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
        return values[(at - 1 + values.length) % values.length];
    }

    if (key === 'Home') {
        return values[0];
    }

    if (key === 'End') {
        return values[values.length - 1];
    }

    return null;
}
