<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import Button from './Button.vue';

/**
 * An Undo after an action: right 16, bottom 104, 360 wide, --raised with --shadow-pop. It exists to offer Undo, so
 * Undo shows only when `undo` is set; it closes by itself after 6000 ms and Undo closes it and runs the undo. It
 * is announced as a status. It slides in from 8 px below over 180 ms (not under reduced motion).
 */
const props = withDefaults(defineProps<{ text: string; undo?: boolean; duration?: number }>(), {
    undo: false,
    duration: 6000,
});
const emit = defineEmits<{ undo: []; close: [] }>();

let timer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => (timer = setTimeout(() => emit('close'), props.duration)));
onBeforeUnmount(() => clearTimeout(timer));

function undoIt(): void {
    emit('undo');
    emit('close');
}
</script>

<template>
    <div
        role="status"
        class="absolute right-4 bottom-26 z-(--z-toast) flex w-90 animate-[toast-in_var(--duration-pop)_var(--ease-journal)] items-center gap-2.5 rounded-menu border border-border-2 bg-raised px-3 py-[9px] text-small text-text-2 shadow-pop"
    >
        <span class="min-w-0 flex-1">{{ text }}</span>
        <template v-if="undo">
            <Button variant="bordered" size="sm" @click="undoIt">Undo</Button>
        </template>
    </div>
</template>
