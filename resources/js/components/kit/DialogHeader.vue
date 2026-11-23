<script setup lang="ts">
import DialogTitle from './DialogTitle.vue';
import IconButton from './IconButton.vue';

/**
 * The top of a Dialog, 48 high with padding 0 8 0 16 and a --line border below: a leading slot (an Avatar), the
 * DialogTitle that takes the free width, a trailing slot (guide dots) and a close IconButton that emits close.
 */
withDefaults(defineProps<{ title: string; closeLabel?: string }>(), { closeLabel: 'Close' });

const emit = defineEmits<{ close: [] }>();
</script>

<template>
    <div class="flex h-12 shrink-0 items-center gap-2.5 border-b border-line pr-2 pl-4">
        <slot name="leading" />
        <DialogTitle>{{ title }}</DialogTitle>
        <slot name="trailing" />
        <IconButton icon="close" :label="closeLabel" :tooltip="false" @click="emit('close')" />
    </div>
</template>
