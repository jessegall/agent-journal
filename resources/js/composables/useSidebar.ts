import { onMounted, ref } from 'vue';

const STORAGE_KEY = 'sidebar-mini';

const isMini = ref(false);

/**
 * Whether the sidebar shows in its 52 px mini form, as version 5's sidebar button switches it. The choice is kept in the
 * browser, so it touches storage only once mounted.
 */
export function useSidebar() {
    function toggle(): void {
        isMini.value = !isMini.value;

        try {
            localStorage.setItem(STORAGE_KEY, isMini.value ? '1' : '0');
        } catch {
            // Storage can be unavailable in a private window; the sidebar still switches for this visit.
        }
    }

    onMounted(() => {
        try {
            isMini.value = localStorage.getItem(STORAGE_KEY) === '1';
        } catch {
            isMini.value = false;
        }
    });

    return { isMini, toggle };
}
