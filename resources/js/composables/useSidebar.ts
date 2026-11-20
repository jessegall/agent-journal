import { onMounted, ref } from 'vue';
import { keepStored, readStored } from '@/composables/browserStorage';

const STORAGE_KEY = 'sidebar-mini';

const isMini = ref(false);

/**
 * Whether the sidebar shows in its 52 px mini form, as version 5's sidebar button switches it. The choice is kept in the
 * browser, so it touches storage only once mounted.
 */
export function useSidebar() {
    function toggle(): void {
        isMini.value = !isMini.value;

        keepStored('local', STORAGE_KEY, isMini.value ? '1' : '0');
    }

    onMounted(() => {
        isMini.value = readStored('local', STORAGE_KEY) === '1';
    });

    return { isMini, toggle };
}
