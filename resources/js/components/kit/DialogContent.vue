<script setup lang="ts">
import { computed, provide, useId } from 'vue';
import DialogBody from './DialogBody.vue';
import DialogFooter from './DialogFooter.vue';
import DialogHeader from './DialogHeader.vue';
import { dialogTitleIdKey } from './dialogTitleId';

/**
 * The shell of a Dialog: a role dialog with aria-modal, named by its title, in --raised with a --border-2 border,
 * radius --radius-card and --shadow-window. It is 460 wide as sm, 540 as md and 560 as lg, and at most the frame
 * minus 96 high. A DialogHeader (the title and a close button) comes first unless header is off or the header slot
 * replaces it; the default slot is the DialogBody; a DialogFooter follows when the footer slot is given, with its
 * secondary actions in the secondary slot. Without a header the dialog is named by aria-label.
 */
const props = withDefaults(
    defineProps<{ title: string; size?: 'sm' | 'md' | 'lg'; header?: boolean; flush?: boolean; closeLabel?: string }>(),
    { size: 'md', header: true, flush: false, closeLabel: 'Close' },
);

const emit = defineEmits<{ close: [] }>();

defineSlots<{
    header?: () => unknown;
    default?: () => unknown;
    secondary?: () => unknown;
    footer?: () => unknown;
}>();

const titleId = `dialog-title-${useId()}`;
const hasHeader = computed(() => props.header);

provide(dialogTitleIdKey, titleId);
</script>

<template>
    <div
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        :aria-labelledby="hasHeader || $slots.header ? titleId : undefined"
        :aria-label="hasHeader || $slots.header ? undefined : title"
        class="flex max-h-[calc(100%-96px)] w-full flex-col overflow-hidden rounded-card border border-border-2 bg-raised outline-none shadow-(--shadow-window)"
        :class="{ sm: 'max-w-115', md: 'max-w-135', lg: 'max-w-140' }[size]"
    >
        <slot name="header">
            <template v-if="hasHeader">
                <DialogHeader :title="title" :close-label="closeLabel" @close="emit('close')" />
            </template>
        </slot>
        <DialogBody :flush="flush">
            <slot />
        </DialogBody>
        <template v-if="$slots.footer">
            <DialogFooter>
                <template v-if="$slots.secondary" #secondary>
                    <slot name="secondary" />
                </template>
                <slot name="footer" />
            </DialogFooter>
        </template>
    </div>
</template>
