import { router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

/**
 * The reads of a filtered list: each visits its URL, and one that gets no answer keeps the rows on screen, marks them
 * stale and remembers its URL, so Retry repeats that same read; nothing retries by itself.
 */
export function useFilteredReads() {
    const failedUrl = ref('');
    const isStale = computed(() => failedUrl.value !== '');

    function markFailed(url: string): boolean {
        failedUrl.value = url;

        return false;
    }

    function read(url: string): void {
        router.get(
            url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    failedUrl.value = '';
                },
                onNetworkError: () => markFailed(url),
                onHttpException: () => markFailed(url),
            },
        );
    }

    function retry(): void {
        read(failedUrl.value);
    }

    return { read, retry, isStale };
}
