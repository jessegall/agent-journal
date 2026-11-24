<script setup lang="ts">
import Button from '@/components/kit/Button.vue';
import Dialog from '@/components/kit/Dialog.vue';
import Icon from '@/components/kit/Icon.vue';
import type { DropZone } from '@/components/panes/paneLayout';

/**
 * Asks, over the one pane it is dropped on, where a window dropped from the add bar goes when the pane already shows
 * one: beside it, under it, or among its tabs. Escape, a click beside it and Cancel place nothing.
 */
defineProps<{ title: string }>();

const emit = defineEmits<{ pick: [zone: DropZone | null] }>();
</script>

<template>
    <div class="contents" @pointerdown.stop>
        <Dialog open title="Split this pane in two?" size="sm" placement="pane" @close="emit('pick', null)">
            <p class="text-small text-pretty text-text-3">{{ title }} can sit beside this pane or join its tabs.</p>
            <template #footer>
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
            </template>
        </Dialog>
    </div>
</template>
