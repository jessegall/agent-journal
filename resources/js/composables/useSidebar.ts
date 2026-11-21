import { onMounted, ref } from 'vue';
import { keepStored, readStored } from '@/composables/browserStorage';

const STORAGE_KEY = 'sidebar-mini';
const PHONE_WIDTH = '(max-width: 760px)';

const isMini = ref(false);
const isOpenOnPhone = ref(false);

/**
 * Whether the sidebar shows in its 52 px mini form, as version 5's sidebar button switches it, kept in the browser and
 * so read only once mounted. On a phone the sidebar is hidden instead, and the same button opens it over the page
 * until a page is chosen.
 */
export function useSidebar() {
    function toggle(): void {
        if (window.matchMedia(PHONE_WIDTH).matches) {
            isOpenOnPhone.value = !isOpenOnPhone.value;

            return;
        }

        isMini.value = !isMini.value;

        keepStored('local', STORAGE_KEY, isMini.value ? '1' : '0');
    }

    function closeOnPhone(): void {
        isOpenOnPhone.value = false;
    }

    onMounted(() => {
        isMini.value = readStored('local', STORAGE_KEY) === '1';
    });

    return { isMini, isOpenOnPhone, toggle, closeOnPhone };
}
