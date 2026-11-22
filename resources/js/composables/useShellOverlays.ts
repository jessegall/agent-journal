import { onBeforeUnmount, onMounted, ref } from 'vue';

const isPaletteOpen = ref(false);
const isHelpOpen = ref(false);

const FIELD = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

/**
 * Whether the command palette and the keyboard help are open. They are the shell's, so the topbar buttons, the
 * shortcuts and the dialogs share this state.
 */
export function useShellOverlays() {
    return { isPaletteOpen, isHelpOpen };
}

/**
 * The shortcuts that open them, for the shell to keep while it is mounted: Control or Command with K opens the palette
 * and a question mark outside a field opens the help.
 */
export function useShellShortcuts(): void {
    function press(event: KeyboardEvent): void {
        const target = event.target as Element | null;

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            isPaletteOpen.value = true;

            return;
        }

        if (event.key === '?' && !event.ctrlKey && !event.metaKey && target?.closest(FIELD) === null) {
            event.preventDefault();
            isHelpOpen.value = true;
        }
    }

    onMounted(() => window.addEventListener('keydown', press));
    onBeforeUnmount(() => window.removeEventListener('keydown', press));
}
