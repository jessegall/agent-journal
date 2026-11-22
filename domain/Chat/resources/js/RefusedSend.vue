<script setup lang="ts">
import Button from '@kit/Button';
import type { RecoveryEntry } from './composables/useMessageDrafts';

/**
 * A send the server refused, or one left over from before a reload: why it was not sent and its text, kept, with
 * Retry, which puts it back into the composer to send again, and Discard.
 */
defineProps<{ entry: RecoveryEntry; reason: string }>();

const emit = defineEmits<{ restore: [intentKey: string]; discard: [intentKey: string] }>();
</script>

<template>
    <div class="flex max-w-[78%] flex-col items-end gap-0.5 self-end">
        <p class="rounded-[10px_10px_4px_10px] border border-border-2 px-3 py-2 text-body whitespace-pre-wrap text-text-2">
            {{ entry.text }}
        </p>
        <span class="flex gap-2 text-small text-tone-warn">
            <span>{{ reason }}</span>
            <Button size="small" variant="ghost" @click="emit('restore', entry.intentKey)">Retry</Button>
            <Button size="small" variant="ghost" @click="emit('discard', entry.intentKey)">Discard</Button>
        </span>
    </div>
</template>
