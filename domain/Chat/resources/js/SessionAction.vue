<script setup lang="ts">
import Button from '@kit/Button';
import type { StatusActionData } from '@generated/types/chat';

/**
 * One thing the agent's status offers now, as a button with the server's words; the bar's one primary action is
 * filled, the others bordered.
 */
defineProps<{ action: StatusActionData; isPrimary: boolean; isPending: boolean }>();

const emit = defineEmits<{ activate: [] }>();
</script>

<template>
    <Button :variant="isPrimary ? 'primary' : 'bordered'" size="small" :pending="isPending" @click="emit('activate')">
        {{ action.label }}
    </Button>
</template>
