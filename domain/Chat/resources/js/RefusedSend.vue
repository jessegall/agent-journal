<script setup lang="ts">
import type { RecoveryEntry } from './composables/useMessageDrafts';

/**
 * A send the server refused, or one left over from before a reload: why it was not sent and its text, to put back
 * into the composer or to discard.
 */
defineProps<{ entry: RecoveryEntry; reason: string }>();

const emit = defineEmits<{ restore: [intentKey: string]; discard: [intentKey: string] }>();
</script>

<template>
    <div class="ml-auto flex max-w-[85%] flex-col items-end gap-0.5">
        <p class="rounded-bubble border border-border-2 px-3 py-2 text-body whitespace-pre-wrap text-text-2">
            {{ entry.text }}
        </p>
        <span class="flex gap-2 text-small text-tone-warn">
            <span>{{ reason }}</span>
            <button type="button" class="underline" @click="emit('restore', entry.intentKey)">Restore</button>
            <button type="button" class="underline" @click="emit('discard', entry.intentKey)">Discard</button>
        </span>
    </div>
</template>
