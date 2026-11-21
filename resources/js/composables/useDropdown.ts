import { ref, useTemplateRef } from 'vue';
import { useCloseOutside } from './useCloseOutside';

/**
 * A dropdown's open state, closed by a pointer outside the element the template names `refName`, which holds both
 * the button and the panel, so the button still toggles it, or by Escape.
 */
export function useDropdown(refName: string) {
    const isOpen = ref(false);
    const root = useTemplateRef<HTMLElement>(refName);

    function close(): void {
        isOpen.value = false;
    }

    function toggle(): void {
        isOpen.value = !isOpen.value;
    }

    useCloseOutside(root, close);

    return { isOpen, toggle, close };
}
