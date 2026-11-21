import { ref } from 'vue';

/**
 * Whether the bell's list is open, shared by the bell and the controls that open it or return focus to it, such as
 * a toast summary's link; the bell registers how its button takes focus.
 */
const isOpen = ref(false);
let focusBell: () => void = () => undefined;

export function useBellPanel() {
    return {
        isOpen,
        open: () => {
            isOpen.value = true;
        },
        focusBell: () => focusBell(),
        registerFocus: (focus: () => void) => {
            focusBell = focus;
        },
    };
}
