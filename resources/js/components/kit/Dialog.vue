<script setup lang="ts">
import { nextTick, onBeforeUnmount, useTemplateRef, watch } from 'vue';
import DialogContent from './DialogContent.vue';
import Scrim from './Scrim.vue';

/**
 * A modal task over a Scrim, above everything else: the title, the body in the default slot and the footer in its
 * slots sit in a DialogContent (size sm, md or lg). It is placed in the middle or 64 or 72 from the top. It opens with
 * the focus on initialFocus (a selector inside it), else on its first field, else on the dialog itself; Tab and
 * Shift+Tab loop inside it; Escape and a click on the Scrim ask the owner to close it through close; and when it
 * closes the focus returns to returnFocus, else to what had it before it opened. It enters over 180ms with a 4px
 * rise and its opacity, and without motion under reduced motion.
 */
const props = withDefaults(
    defineProps<{
        open: boolean;
        title: string;
        size?: 'sm' | 'md' | 'lg';
        placement?: 'center' | 'top-64' | 'top-72';
        header?: boolean;
        initialFocus?: string;
        returnFocus?: HTMLElement;
    }>(),
    { size: 'md', placement: 'center', header: true, initialFocus: undefined, returnFocus: undefined },
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
    <Teleport to="body">
        <template v-if="open">
            <div
                class="fixed inset-0 z-(--z-dialog) flex justify-center"
                :class="{ center: 'items-center', 'top-64': 'items-start pt-16', 'top-72': 'items-start pt-18' }[placement]"
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
                    class="relative mx-4 transition duration-(--duration-pop) ease-journal starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none"
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
