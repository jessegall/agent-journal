import { computed, inject, provide } from 'vue';
import type { ComputedRef, InjectionKey } from 'vue';

const isStaleKey: InjectionKey<ComputedRef<boolean>> = Symbol(
    'the window shows its last read after a failed refresh',
);

/**
 * Tells a window's content whether what it shows is its last read, kept after a refresh failed.
 */
export function provideIsStale(isStale: ComputedRef<boolean>): void {
    provide(isStaleKey, isStale);
}

/**
 * Whether the window shows its last read after a refresh failed, so its actions wait for a read that succeeds;
 * content outside a window is always fresh.
 */
export function useIsStale(): ComputedRef<boolean> {
    return inject(
        isStaleKey,
        computed(() => false),
        false,
    );
}
