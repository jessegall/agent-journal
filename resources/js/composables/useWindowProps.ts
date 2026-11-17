import { router, usePage } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
import type { WindowResult } from '@/generated/types/page-props';

/**
 * One window or section prop: its current result, the Data last shown before a failure (cleared when the user may no
 * longer see it), and a retry that reloads only this prop. An optional window prop is asked for once it is shown.
 */
export function useWindowProps(propName: string, askOnStart = true) {
    const page = usePage();
    const result = computed(() => page.props[propName] as WindowResult<unknown> | null | undefined);
    const keptData = ref<unknown>(undefined);

    watch(
        result,
        (current) => {
            if (current?.state === 'ready') {
                keptData.value = current.data;
            }

            if (current?.state === 'denied') {
                keptData.value = undefined;
            }
        },
        { immediate: true },
    );

    function retry(): void {
        router.reload({ only: [propName] });
    }

    if (askOnStart && result.value === undefined) {
        retry();
    }

    return { result, keptData, retry };
}
