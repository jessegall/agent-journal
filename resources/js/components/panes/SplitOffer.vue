<script setup lang="ts">
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import type { DropZone } from './paneLayout';

/**
 * Version 5's split offer (panes/SplitOffer.vue): a window dropped from the add bar onto a pane that already shows one
 * asks whether to sit beside it, under it, or join its tabs.
 */
defineProps<{ title: string }>();

const emit = defineEmits<{ pick: [zone: DropZone | null] }>();
</script>

<template>
    <div
        class="absolute inset-0 z-5 grid place-items-center bg-[rgba(13,14,16,.62)] p-4"
        @pointerdown.stop
    >
        <div
            class="w-[min(410px,100%)] rounded-bubble border border-border-2 bg-raised p-4 shadow-[0_12px_32px_rgba(0,0,0,.45)]"
            role="dialog"
            aria-label="Split this pane in two?"
        >
            <p class="font-medium text-card text-text">
                Split this pane in two?
            </p>
            <p class="mt-1 mb-3.5 text-small text-pretty text-text-3">
                {{ title }} can sit beside this pane or join its tabs.
            </p>
            <div class="flex flex-wrap gap-1.5">
                <Button variant="primary" @click="emit('pick', 'right')"
                    ><Icon name="columns" :size="13" />Side by side</Button
                >
                <Button variant="bordered" @click="emit('pick', 'below')"
                    ><Icon name="rows" :size="13" />Stacked</Button
                >
                <Button variant="bordered" @click="emit('pick', 'centre')"
                    ><Icon name="tab" :size="13" />Add as tab</Button
                >
                <Button @click="emit('pick', null)">Cancel</Button>
            </div>
        </div>
    </div>
</template>
