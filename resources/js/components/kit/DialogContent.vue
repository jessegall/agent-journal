<script setup lang="ts">
import { computed, provide, useId } from 'vue';
import DialogBody from './DialogBody.vue';
import DialogFooter from './DialogFooter.vue';
import DialogHeader from './DialogHeader.vue';
import { dialogTitleIdKey } from './dialogTitleId';

/**
 * The shell of a Dialog: a modal dialog named by its title, sized sm, md or lg, with a DialogHeader unless header is
 * off or replaced, the DialogBody in the default slot, and a DialogFooter when the footer slot is given. Without a
 * header it is named by aria-label. Measures: docs/designs/kit-components.md.
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
