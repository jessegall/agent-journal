<script setup lang="ts">
import Button from './Button.vue';

/**
 * Says that a list shows its earlier results because its last read got no answer, with the reason in the caller's
 * words, and offers Retry of that same read.
 */
defineProps<{ reason: string }>();
defineEmits<{ retry: [] }>();
</script>

<template>
    <div
        role="alert"
        class="flex items-center gap-3 border-b border-border px-3 py-2 text-small text-text-2"
    >
        <span class="flex-1">Showing earlier results. {{ reason }}</span>
        <Button variant="bordered" size="small" @click="$emit('retry')"
            >Retry</Button
        >
    </div>
</template>
