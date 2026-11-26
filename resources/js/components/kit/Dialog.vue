<script setup lang="ts">
import { nextTick, onBeforeUnmount, useTemplateRef, watch } from 'vue';
import { overlayTarget } from '@/composables/overlayLayer';
import DialogContent from './DialogContent.vue';
import Scrim from './Scrim.vue';

/**
 * A modal task over a Scrim: its title, body and footer in a DialogContent, in the middle, near the top, or over one
 * pane. It opens on initialFocus or its first field, keeps Tab inside, asks its owner to close on Escape or a Scrim
 * click, and returns the focus. Measures: docs/designs/kit-components.md.
 */
const props = withDefaults(
    defineProps<{
        open: boolean;
        title: string;
        size?: 'sm' | 'md' | 'lg';
        placement?: 'center' | 'top-64' | 'top-72' | 'pane';
        header?: boolean;
        flush?: boolean;
        initialFocus?: string;
        returnFocus?: HTMLElement;
    }>(),
    { size: 'md', placement: 'center', header: true, flush: false, initialFocus: undefined, returnFocus: undefined },
);

const emit = defineEmits<{ close: [] }>();

defineSlots<{
    header?: () => unknown;
    default?: () => unknown;
    secondary?: () => unknown;
    footer?: () => unknown;
}>();

const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const FIELD = 'input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

const content = useTemplateRef<InstanceType<typeof DialogContent>>('content');
let opener: HTMLElement | null = null;

function dialogElement(): HTMLElement | null {
    return (content.value?.$el as HTMLElement | undefined) ?? null;
}

function giveFocusBack(): void {
    (props.returnFocus ?? opener)?.focus();
    opener = null;
}

async function takeFocus(): Promise<void> {
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    await nextTick();

    const dialog = dialogElement();
    const wanted = props.initialFocus === undefined ? null : dialog?.querySelector<HTMLElement>(props.initialFocus);

    (wanted ?? dialog?.querySelector<HTMLElement>(FIELD) ?? dialog)?.focus();
}

function keepFocusInside(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        event.stopPropagation();
        emit('close');

        return;
    }

    const dialog = dialogElement();

    if (event.key !== 'Tab' || dialog === null) {
        return;
    }

    const focusable = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)];

    if (focusable.length === 0) {
        event.preventDefault();

        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const isLeaving = event.shiftKey ? document.activeElement === first || document.activeElement === dialog : document.activeElement === last;

    if (!isLeaving) {
        return;
    }

    event.preventDefault();
    (event.shiftKey ? last : first).focus();
}

watch(
    () => props.open,
    (isOpen) => (isOpen ? void takeFocus() : giveFocusBack()),
    { immediate: true },
);

onBeforeUnmount(() => {
    if (props.open) {
        giveFocusBack();
    }
});
</script>

<template>
    <Teleport :to="overlayTarget()" :disabled="placement === 'pane'">
        <template v-if="open">
            <div
                class="inset-0 flex justify-center"
                :class="{
                    center: 'fixed z-(--z-dialog) items-center',
                    'top-64': 'fixed z-(--z-dialog) items-start pt-16',
                    'top-72': 'fixed z-(--z-dialog) items-start pt-18',
                    pane: 'absolute z-5 items-center',
                }[placement]"
                @keydown="keepFocusInside"
            >
                <Scrim
                    class="starting:opacity-0 transition duration-(--duration-pop) motion-reduce:transition-none"
                    @close="emit('close')"
                />
                <DialogContent
                    ref="content"
                    :title="title"
                    :size="size"
                    :header="header"
                    :flush="flush"
                    class="relative z-(--z-dialog) mx-4 transition duration-(--duration-pop) ease-journal starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none"
                    @close="emit('close')"
                >
                    <template v-if="$slots.header" #header>
                        <slot name="header" />
                    </template>
                    <slot />
                    <template v-if="$slots.secondary" #secondary>
                        <slot name="secondary" />
                    </template>
                    <template v-if="$slots.footer" #footer>
                        <slot name="footer" />
                    </template>
                </DialogContent>
            </div>
        </template>
    </Teleport>
</template>
