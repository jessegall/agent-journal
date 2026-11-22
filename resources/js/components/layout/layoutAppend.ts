import { inject, provide, ref } from 'vue';
import type { InjectionKey, Ref } from 'vue';

const APPENDING: InjectionKey<Ref<boolean>> = Symbol('journal.layout-append');

/**
 * Lets a layout's Show more tell its rows that the next read adds to them instead of replacing them.
 */
export function provideLayoutAppend(): void {
    provide(APPENDING, ref(false));
}

/**
 * Whether the read now coming in is added to the rows shown; it is true only while a Show more waits for its answer.
 */
export function useLayoutAppend(): Ref<boolean> {
    return inject(APPENDING, ref(false));
}
