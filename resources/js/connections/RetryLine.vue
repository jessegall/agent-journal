<script setup lang="ts">
import Button from '@kit/Button';

/**
 * A line saying what did not go through, with the button that tries it again.
 */
defineProps<{ action: string }>();
defineEmits<{ retry: [] }>();
</script>

<template>
    <p role="alert" class="flex items-center gap-2 px-3 py-1.5 text-small text-text-2">
        <slot />
        <Button size="sm" variant="bordered" @click="$emit('retry')">{{ action }}</Button>
    </p>
</template>
