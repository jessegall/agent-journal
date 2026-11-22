import { onBeforeUnmount, onMounted, ref } from 'vue';

const isPaletteOpen = ref(false);
const isHelpOpen = ref(false);
const isSearchOpen = ref(false);

const FIELD = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

/**
 * Whether the search palette, the command palette and the keyboard help are open. They are the shell's, so the
 * topbar buttons, the shortcuts and the dialogs share this state; one of them is open at a time.
 */
export function useShellOverlays() {
    return { isPaletteOpen, isHelpOpen, isSearchOpen };
}

/**
 * The shortcuts that open them, for the shell to keep while it is mounted: Control or Command with K opens the search
 * palette and a question mark outside a field opens the help. A shortcut never opens a second dialog over an open one.
 */
export function useShellShortcuts(): void {
    function press(event: KeyboardEvent): void {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();

            if (!isPaletteOpen.value && !isHelpOpen.value) {
                isSearchOpen.value = true;
            }

            return;
        }

        const asksForHelp = event.key === '?' && !event.ctrlKey && !event.metaKey;
        const isTypingInField = event.target instanceof Element && event.target.closest(FIELD) !== null;

        if (asksForHelp && !isTypingInField) {
            event.preventDefault();
            isHelpOpen.value = true;
        }
    }

    onMounted(() => window.addEventListener('keydown', press));
    onBeforeUnmount(() => window.removeEventListener('keydown', press));
}
