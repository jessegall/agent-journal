<script setup lang="ts">
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

/**
 * A modal window of one fixed size on every step: a 480 px wide native dialog with a 52 px header holding the title,
 * a bar per step (blue up to the step shown) and a close button, a 420 px body and a 52 px footer. The Tab key stays
 * inside it, and the close button and Escape ask the owner to close it through the close event.
 */
const props = withDefaults(
    defineProps<{
        isOpen: boolean;
        title: string;
        stepCount?: number;
        step?: number;
    }>(),
    { stepCount: 0, step: 0 },
);

const emit = defineEmits<{
    close: [];
}>();

defineSlots<{
    default?: () => unknown;
    footer?: () => unknown;
}>();

const dialog = ref<HTMLDialogElement | null>(null);

const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

async function showOrHide(isOpen: boolean): Promise<void> {
    await nextTick();
    const element = dialog.value;

    if (element === null) {
        return;
    }

    if (isOpen && !element.open) {
        element.showModal();
        element.querySelector<HTMLElement>(FOCUSABLE)?.focus();

        return;
    }

    if (!isOpen && element.open) {
        element.close();
    }
}

watch(() => props.isOpen, showOrHide, { immediate: true });

onBeforeUnmount(() => dialog.value?.close());

/**
 * Escape is the dialog's cancel: the owner decides whether it closes, as with the close button.
 */
function askToClose(event: Event): void {
    event.preventDefault();
    emit('close');
}

/**
 * Keeps the Tab key inside the window, from the last control round to the first and back.
 */
function keepFocusInside(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || dialog.value === null) {
        return;
    }

    const focusable = [...dialog.value.querySelectorAll<HTMLElement>(FOCUSABLE)];

    if (focusable.length === 0) {
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const isLeaving = event.shiftKey
        ? document.activeElement === first
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
        :aria-label="title"
        class="m-auto w-[480px] overflow-hidden rounded-card border border-border-2 bg-bg p-0 text-body text-text shadow-[0_16px_48px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.06)] backdrop:bg-black/30"
        @cancel="askToClose"
        @keydown="keepFocusInside"
    >
        <div class="flex flex-col">
            <header
                class="flex h-[52px] items-center gap-3 border-b border-line pr-3 pl-5"
            >
                <h3 class="m-0 flex-1 text-title font-semibold">{{ title }}</h3>
                <span
                    v-if="stepCount > 0"
                    class="flex items-center gap-1"
                    :aria-label="`Step ${step} of ${stepCount}`"
                >
                    <i
                        v-for="bar in stepCount"
                        :key="bar"
                        data-step-bar
                        :data-done="bar <= step"
                        class="block h-[3px] w-5 rounded-[2px]"
                        :class="bar <= step ? 'bg-brand' : 'bg-border-2'"
                    />
                </span>
                <Button variant="icon" aria-label="Close" @click="emit('close')">
                    <Icon name="close" />
                </Button>
            </header>
            <div class="flex h-[420px] flex-col gap-4 p-5">
                <slot />
            </div>
            <footer
                class="flex h-[52px] items-center gap-2 border-t border-line bg-bg-2 px-3"
            >
                <slot name="footer" />
            </footer>
        </div>
    </dialog>
</template>
