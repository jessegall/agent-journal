<script setup lang="ts">
import type { SharePreviewData } from '@generated/types/sharing';
import Button from '@kit/Button';

/**
 * The button that confirms the saved preview as the new members of the record's live share.
 */
defineProps<{
    liveShare: NonNullable<SharePreviewData['liveShare']>;
    processing: boolean;
}>();
defineEmits<{ confirmTo: [url: string] }>();
</script>

<template>
    <Button
        type="button"
        :disabled="processing"
        @click="$emit('confirmTo', `/sharing/shares/${liveShare.id}/scope`)"
        >Update share {{ liveShare.number }}</Button
    >
</template>
