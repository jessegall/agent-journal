<script setup lang="ts">
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

/**
 * A titled panel that rises from the bottom at compact width: a native modal dialog whose body scrolls on its own,
 * focus moved to its heading when it opens, the Tab key kept inside it, Escape and Close asking the owner to close
 * it, and focus given back to whatever opened it.
 */
const props = defineProps<{
    isOpen: boolean;
    title: string;
}>();

const emit = defineEmits<{
    close: [];
}>();

defineSlots<{
    default?: () => unknown;
}>();

const dialog = ref<HTMLDialogElement | null>(null);
const heading = ref<HTMLElement | null>(null);
let opener: HTMLElement | null = null;

const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

async function showOrHide(isOpen: boolean): Promise<void> {
    await nextTick();
    const element = dialog.value;

    if (element === null) {
        return;
    }

    if (isOpen && !element.open) {
        opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        element.showModal();
        heading.value?.focus();

        return;
    }

    if (!isOpen && element.open) {
        element.close();
        opener?.focus();
        opener = null;
    }
}

watch(() => props.isOpen, showOrHide, { immediate: true });

onBeforeUnmount(() => dialog.value?.close());

/**
 * Escape is the dialog's cancel: the owner decides whether it closes, as with the Close button.
 */
function askToClose(event: Event): void {
    event.preventDefault();
    emit('close');
}

/**
 * Keeps the Tab key inside the sheet, from the last control round to the first and back.
 */
function keepFocusInside(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || dialog.value === null) {
        return;
    }

    const focusable = [...dialog.value.querySelectorAll<HTMLElement>(FOCUSABLE)];

    if (focusable.length === 0) {
        event.preventDefault();

        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const isLeaving = event.shiftKey
        ? document.activeElement === first || document.activeElement === heading.value
        : document.activeElement === last;

    if (!isLeaving) {
        return;
    }

    event.preventDefault();
    (event.shiftKey ? last : first).focus();
}
</script>

<template>
    <dialog
        ref="dialog"
        aria-labelledby="sheet-title"
        class="mt-auto mb-0 w-full max-w-none overflow-hidden rounded-t-card border border-border-2 bg-bg p-0 text-body text-text backdrop:bg-black/30"
        @cancel="askToClose"
        @keydown="keepFocusInside"
    >
        <div class="flex max-h-[85dvh] flex-col">
            <header class="flex h-[52px] shrink-0 items-center gap-3 border-b border-line pr-3 pl-5">
                <h2 id="sheet-title" ref="heading" tabindex="-1" class="m-0 min-w-0 flex-1 text-title font-semibold">
                    {{ title }}
                </h2>
                <Button variant="icon" aria-label="Close" @click="emit('close')">
                    <Icon name="close" />
                </Button>
            </header>
            <div class="min-h-0 flex-1 overflow-y-auto p-3">
                <slot />
            </div>
        </div>
    </dialog>
</template>
