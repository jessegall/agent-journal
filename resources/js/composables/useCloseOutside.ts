import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted } from 'vue';

/**
 * Closes a floating panel when a pointer goes down outside it or Escape is pressed, for as long as the panel is shown.
 */
export function useCloseOutside(
    panel: Ref<HTMLElement | null>,
    close: () => void,
): void {
    function closeOnOutsideClick(event: PointerEvent): void {
        if (panel.value && !panel.value.contains(event.target as Node)) {
            close();
        }
    }

    function closeOnEscape(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            close();
        }
    }

    onMounted(() => {
        window.addEventListener('pointerdown', closeOnOutsideClick, true);
        window.addEventListener('keydown', closeOnEscape);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('pointerdown', closeOnOutsideClick, true);
        window.removeEventListener('keydown', closeOnEscape);
    });
}
